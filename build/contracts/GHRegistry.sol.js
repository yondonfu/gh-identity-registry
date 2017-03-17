var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("GHRegistry error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("GHRegistry error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("GHRegistry contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of GHRegistry: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to GHRegistry.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: GHRegistry not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "registry",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_a",
            "type": "address"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "gistPath",
            "type": "string"
          }
        ],
        "name": "verifyUsername",
        "outputs": [],
        "payable": true,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "queryId",
            "type": "bytes32"
          },
          {
            "name": "result",
            "type": "string"
          }
        ],
        "name": "__callback",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "idx",
            "type": "uint256"
          }
        ],
        "name": "getRegistryEntry",
        "outputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "oraclizeGas",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "s",
            "type": "string"
          },
          {
            "name": "claimant",
            "type": "address"
          },
          {
            "name": "username",
            "type": "string"
          }
        ],
        "name": "checkGist",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "withdrawCollateral",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "registryEntries",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getRegistrySize",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "gistPath",
            "type": "string"
          }
        ],
        "name": "createGistUrl",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "minCollateral",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [
          {
            "name": "_minCollateral",
            "type": "uint256"
          },
          {
            "name": "_oraclizeGas",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "success",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "claimant",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "username",
            "type": "string"
          }
        ],
        "name": "VerifyUsernameComplete",
        "type": "event"
      }
    ],
    "unlinked_binary": "0x60606040523461000057604051604080611a4e8339810160405280516020909101515b60008054600160a060020a031916736f485c8bf6fc43ea212e93bbf8ce046c7f1cb475179055600382905560028190555b50505b6119ea806100646000396000f3606060405236156100985760e060020a6000350463038defd7811461009d5780631a6952301461011b578063243a723e1461012d57806327dc297e146101ba5780633d93db72146102105780633e9836c61461029e5780634bb729b8146102bd57806359c153be14610366578063665e31ee146103755780639725843b146103a15780639cc5bbf7146103c0578063ba2de9bc146104be575b610000565b34610000576100ad6004356104dd565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561010d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005761012b600435610578565b005b61012b600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061070b95505050505050565b005b346100005760408051602060046024803582810135601f810185900485028601850190965285855261012b958335959394604494939290920191819084018382808284375094965061089795505050505050565b005b3461000057610220600435610c8e565b6040518083600160a060020a03168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561028f5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34610000576102ab610d7c565b60408051918252519081900360200190f35b3461000057610352600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f818a01358b0180359182018390048302840183018552818452989a8a359a909994019750919550918201935091508190840183828082843750949650610d8295505050505050565b604080519115158252519081900360200190f35b346100005761012b610e9f565b005b3461000057610385600435610f36565b60408051600160a060020a039092168252519081900360200190f35b34610000576102ab610f66565b60408051918252519081900360200190f35b34610000576100ad600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650610f6d95505050505050565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561010d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610000576102ab61102b565b60408051918252519081900360200190f35b60056020908152600091825260409182902080548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845290918301828280156105705780601f1061054557610100808354040283529160200191610570565b820191906000526020600020905b81548152906001019060200180831161055357829003601f168201915b505050505081565b600160a060020a03331660009081526005602052604081205460026000196101006001841615020190911604116105ae57610000565b6005600033600160a060020a031681526020019081526020016000206005600083600160a060020a031681526020019081526020016000209080546001816001161561010002031660029004828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610633578054855561066f565b8280016001018555821561066f57600052602060002091601f016020900482015b8281111561066f578254825591600101919060010190610654565b5b506106909291505b8082111561068c5760008155600101610678565b5090565b50506005600033600160a060020a03168152602001908152602001600020805460018160011615610100020316600290046000825580601f106106d35750610705565b601f01602090049060005260206000209081019061070591905b8082111561068c5760008155600101610678565b5090565b5b505b50565b60006000600060035434101561072057610000565b60408051808201909152600381527f55524c00000000000000000000000000000000000000000000000000000000006020820152600160a060020a0330163193506107779061076f8787610f6d565b600254611031565b604080518082018252338152602080820189815260008581526006835293842083518154606060020a91820291909104600160a060020a0319909116178155905180516001808401805481895297869020989a50600160a060020a03301631995095979396601f60029282161561010002600019019091169190910481018590048401949193929091019083901061081a57805160ff1916838001178555610847565b82800160010185558215610847579182015b8281111561084757825182559160200191906001019061082c565b5b506108689291505b8082111561068c5760008155600101610678565b5090565b505050600160a060020a033316600090815260076020526040902080548386033403019055505b5b5050505050565b604080518082018252600080825282516020818101909452908152918101919091526108c161130d565b600160a060020a031633600160a060020a03161415156108e057610000565b600083815260066020908152604091829020825180840184528154600160a060020a03168152600180830180548651601f6002948316156101000260001901909216939093049081018690048602830186019096528582529194929385810193919291908301828280156109955780601f1061096a57610100808354040283529160200191610995565b820191906000526020600020905b81548152906001019060200180831161097857829003601f168201915b50505050508152602001505090506109b68282600001518360200151610d82565b15610bb1578060200151600560008360000151600160a060020a031681526020019081526020016000209080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a2957805160ff1916838001178555610a56565b82800160010185558215610a56579182015b82811115610a56578251825591602001919060010190610a3b565b5b50610a779291505b8082111561068c5760008155600101610678565b5090565b505060048054806001018281815481835581811511610abb57600083815260209020610abb9181019083015b8082111561068c5760008155600101610678565b5090565b5b505050916000526020600020900160005b8360000151909190916101000a815481600160a060020a030219169083606060020a908102040217905550507f2dca11b0fed78714cb948a48be97c6b2fbf6461e03f7f19acc4454ee122e36d760018260000151836020015160405180841515815260200183600160a060020a03168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610b9d5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a1610c87565b600760008260000151600160a060020a0316815260200190815260200160002054507f2dca11b0fed78714cb948a48be97c6b2fbf6461e03f7f19acc4454ee122e36d760008260000151836020015160405180841515815260200183600160a060020a03168152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610c775780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15b5b5b505050565b600060206040519081016040528060008152602001506000600484815481101561000057906000526020600020900160005b905461010091820a9004600160a060020a031660008181526005602090815260409182902080548351600260018316159097026000190190911695909504601f81018390048302860183019093528285529294508493918391830182828015610d6a5780601f10610d3f57610100808354040283529160200191610d6a565b820191906000526020600020905b815481529060010190602001808311610d4d57829003601f168201915b50505050509050925092505b50915091565b60025481565b60408051808201825260008082526020808301829052835180850185528281528082018390528451808601909552828552908401829052909283610dcb8863ffffffff61142616565b60408051808201909152600181527f0a000000000000000000000000000000000000000000000000000000000000006020820152909450610e119063ffffffff61142616565b9250610e23848463ffffffff61145616565b9150610e3e610e3187611426565b839063ffffffff61147d16565b15610e4c5760009450610e93565b610e6c610e67610e62868663ffffffff61145616565b61152e565b611594565b9050600160a060020a0380821690881614610e8e5760009450610e9356610e93565b600194505b5b505050509392505050565b33600160a060020a038116600090815260076020526040902054801515610ec557610000565b8030600160a060020a0316311015610edc57610000565b600160a060020a0382166000818152600760205260408082208290555183156108fc0291849190818181858888f19350505050151561070557600160a060020a03821660009081526007602052604090208190555b5b5050565b600481815481101561000057906000526020600020900160005b915054906101000a9004600160a060020a031681565b6004545b90565b604080516020810190915260008152611022610f8e8363ffffffff61142616565b611005611011610f9d87611426565b611005606060405190810160405280602381526020017f68747470733a2f2f676973742e67697468756275736572636f6e74656e742e6381526020017f6f6d2f0000000000000000000000000000000000000000000000000000000000815260200150611426565b9063ffffffff6116ef16565b611426565b9063ffffffff6116ef16565b90505b92915050565b60035481565b600080548190600160a060020a0316151561105257611050600061176f565b505b600060009054906101000a9004600160a060020a0316600160a060020a03166338cc48316000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100005760325a03f1156100005750505060405180519060200150600160006101000a815481600160a060020a030219169083606060020a908102040217905550600160009054906101000a9004600160a060020a0316600160a060020a0316632ef3accc86856000604051602001526040518360e060020a02815260040180806020018381526020018281038252848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156111825780820380516001836020036101000a031916815260200191505b509350505050602060405180830381600087803b156100005760325a03f11561000057505060405151915050670de0b6b3a76400003a8402018111156111cb5760009150611304565b600160009054906101000a9004600160a060020a0316600160a060020a031663c51be90f8260008888886000604051602001526040518660e060020a0281526004018085815260200180602001806020018481526020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561127a5780820380516001836020036101000a031916815260200191505b508381038252858181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156112d35780820380516001836020036101000a031916815260200191505b5096505050505050506020604051808303818588803b156100005761235a5a03f11561000057505060405151935050505b5b509392505050565b60008054600160a060020a0316151561132c5761132a600061176f565b505b600060009054906101000a9004600160a060020a0316600160a060020a03166338cc48316000604051602001526040518160e060020a028152600401809050602060405180830381600087803b156100005760325a03f11561000057505060408051805160018054600160a060020a031916606060020a9283029290920491909117908190556000602092830181905283517fc281d19e0000000000000000000000000000000000000000000000000000000081529351600160a060020a03909216945063c281d19e936004808201949392918390030190829087803b156100005760325a03f115610000575050604051519150505b5b90565b60408051808201825260008082526020918201528151808301909252825182528281019082018190525b50919050565b6040805180820190915260008082526020820152611475838383611873565b505b92915050565b6000600060006000600060006000600060008a6000015197508a600001518a6000015110156114ab57895197505b8a60200151965089602001519550600094505b87851015611518578651865190945092508284146114ff5750506000196008602088900385010260020a01198181168382160380156114ff57809850611520565b5b6020870196506020860195505b6020850194506114be565b89518b510398505b505050505050505092915050565b6040805160208181018352600080835283519182018452808252845193519293919290919080591061155d5750595b8181526020808302820101604052905b50915060208201905061158981856020015186600001516118ee565b8192505b5050919050565b60408051602081019091526000908190528181808060025b602a8110156116e15761010084029350848181518110156100005790602001015160f860020a900460f860020a0260f860020a900492508481600101815181101561000057016020015160f860020a9081900481020491506061600160a060020a038416108015906116285750606683600160a060020a031611155b1561163857605783039250611668565b603083600160a060020a03161015801561165c5750603983600160a060020a031611155b15611668576030830392505b5b606182600160a060020a03161015801561168d5750606682600160a060020a031611155b1561169d576057820391506116cd565b603082600160a060020a0316101580156116c15750603982600160a060020a031611155b156116cd576030820391505b5b818360100201840193505b6002016115ac565b8395505b5050505050919050565b604080516020818101835260008083528351918201845280825284518651945193949293919201908059106117215750595b8181526020808302820101604052905b50915060208201905061174d81866020015187600001516118ee565b84516020850151855161176392840191906118ee565b8192505b505092915050565b60006000611790731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed611937565b11156117c4575060008054600160a060020a031916731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed179055600161186e565b60006117e373c03a2615d5efaf5f49f60b7bb6583eaec212fdf1611937565b1115611817575060008054600160a060020a03191673c03a2615d5efaf5f49f60b7bb6583eaec212fdf1179055600161186e565b60006118367351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa611937565b111561186a575060008054600160a060020a0319167351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa179055600161186e565b5060005b919050565b60408051808201909152600080825260208083018290528551868201518651928701516118a0939061193f565b602080870180519186019190915280518203855286519051919250018114156118cc57600085526118e2565b8351835186519101900385528351810160208601525b8291505b509392505050565b60005b602082106119135782518452602093840193909201915b6020820391506118f1565b6001826020036101000a039050801983511681855116818117865250505b50505050565b803b5b919050565b6000808080808887116119d6576020871161199a5760018760200360080260020a031980875116888b038a018a96505b81838851161461198b57600187019681901061196f578b8b0196505b5050508394506119de566119d6565b8686209150879350600092505b86890383116119d65750858320818114156119c4578394506119de565b6001840193505b6001909201916119a7565b5b5b88880194505b5050505094935050505056",
    "events": {
      "0x2dca11b0fed78714cb948a48be97c6b2fbf6461e03f7f19acc4454ee122e36d7": {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "success",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "claimant",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "username",
            "type": "string"
          }
        ],
        "name": "VerifyUsernameComplete",
        "type": "event"
      }
    },
    "updated_at": 1489718372386,
    "links": {},
    "address": "0x54bdcb4cc2d3afdd01dd4fdb79185cc265ce3a33"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "GHRegistry";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.GHRegistry = Contract;
  }
})();
