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
    "unlinked_binary": "0x60606040523461000057604051604080611b0e8339810160405280516020909101515b60008054600160a060020a031916736f485c8bf6fc43ea212e93bbf8ce046c7f1cb475179055600382905560028190555b50505b611aa9806100656000396000f3006060604052361561009e5763ffffffff60e060020a600035041663038defd781146100a35780631a6952301461013c578063243a723e1461015757806327dc297e146101e45780633d93db721461023a5780633e9836c6146102dd5780634bb729b8146102fc57806359c153be146103ae578063665e31ee146103bd5780639725843b146103e95780639cc5bbf714610408578063ba2de9bc14610518575b610000565b34610000576100bc600160a060020a0360043516610537565b604080516020808252835181830152835191928392908301918501908083838215610102575b80518252602083111561010257601f1990920191602091820191016100e2565b505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3461000057610155600160a060020a03600435166105d2565b005b610155600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061077695505050505050565b005b346100005760408051602060046024803582810135601f8101859004850286018501909652858552610155958335959394604494939290920191819084018382808284375094965061090095505050505050565b005b346100005761024a600435610d01565b60408051600160a060020a038416815260208082018381528451938301939093528351919291606084019185019080838382156102a2575b8051825260208311156102a257601f199092019160209182019101610282565b505050905090810190601f1680156102ce5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b34610000576102ea610dec565b60408051918252519081900360200190f35b346100005761039a600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f818a01358b0180359182018390048302840183018552818452989a600160a060020a038b35169a909994019750919550918201935091508190840183828082843750949650610df295505050505050565b604080519115158252519081900360200190f35b3461000057610155610f00565b005b34610000576103cd600435610f97565b60408051600160a060020a039092168252519081900360200190f35b34610000576102ea610fc7565b60408051918252519081900360200190f35b34610000576100bc600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b01803591820183900483028401830190945280835297999881019791965091820194509250829150840183828082843750949650610fce95505050505050565b604080516020808252835181830152835191928392908301918501908083838215610102575b80518252602083111561010257601f1990920191602091820191016100e2565b505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34610000576102ea611083565b60408051918252519081900360200190f35b60056020908152600091825260409182902080548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845290918301828280156105ca5780601f1061059f576101008083540402835291602001916105ca565b820191906000526020600020905b8154815290600101906020018083116105ad57829003601f168201915b505050505081565b600160a060020a033316600090815260056020526040812054600260001961010060018416150201909116041161060857610000565b6005600033600160a060020a0316600160a060020a031681526020019081526020016000206005600083600160a060020a0316600160a060020a031681526020019081526020016000209080546001816001161561010002031660029004828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061069f57805485556106db565b828001600101855582156106db57600052602060002091601f016020900482015b828111156106db5782548255916001019190600101906106c0565b5b506106fc9291505b808211156106f857600081556001016106e4565b5090565b5050600160a060020a033316600090815260056020526040812080549181559060026000196101006001841615020190911604601f81901061073e5750610770565b601f01602090049060005260206000209081019061077091905b808211156106f857600081556001016106e4565b5090565b5b505b50565b60006000600060035434101561078b57610000565b30600160a060020a03163192506107e4604060405190810160405280600381526020017f55524c00000000000000000000000000000000000000000000000000000000008152506107dc8787610fce565b600254611089565b60408051808201825233600160a060020a03908116825260208083018a815260008681526006835294852084518154908516600160a060020a03199091161781559051805160018084018054818a5298869020999b503096909616319950959792969495601f60029187161561010002600019019096160485018490048301949093919091019083901061088357805160ff19168380011785556108b0565b828001600101855582156108b0579182015b828111156108b0578251825591602001919060010190610895565b5b506108d19291505b808211156106f857600081556001016106e4565b5090565b505050600160a060020a033316600090815260076020526040902080548386033403019055505b5b5050505050565b6040805180820182526000808252825160208181019094529081529181019190915261092a6113a1565b600160a060020a031633600160a060020a031614151561094957610000565b600083815260066020908152604091829020825180840184528154600160a060020a03168152600180830180548651601f6002948316156101000260001901909216939093049081018690048602830186019096528582529194929385810193919291908301828280156109fe5780601f106109d3576101008083540402835291602001916109fe565b820191906000526020600020905b8154815290600101906020018083116109e157829003601f168201915b5050505050815250509050610a1c8282600001518360200151610df2565b15610c24578060200151600560008360000151600160a060020a0316600160a060020a031681526020019081526020016000209080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a9857805160ff1916838001178555610ac5565b82800160010185558215610ac5579182015b82811115610ac5578251825591602001919060010190610aaa565b5b50610ae69291505b808211156106f857600081556001016106e4565b5090565b505060048054806001018281815481835581811511610b2a57600083815260209020610b2a9181019083015b808211156106f857600081556001016106e4565b5090565b5b505050916000526020600020900160005b83518254600160a060020a038083166101009490940a8481029102199091161790925560208085015160408051600180825281850195909552606091810182815283519282019290925282517f2dca11b0fed78714cb948a48be97c6b2fbf6461e03f7f19acc4454ee122e36d797509495949293909260808401918501908083838215610be4575b805182526020831115610be457601f199092019160209182019101610bc4565b505050905090810190601f168015610c105780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a1610cfa565b8051600160a060020a039081166000908152600760209081528351818501516040805185815295831686850152606090860181815282519187019190915281517f2dca11b0fed78714cb948a48be97c6b2fbf6461e03f7f19acc4454ee122e36d79693949293926080840191908501908083838215610cbe575b805182526020831115610cbe57601f199092019160209182019101610c9e565b505050905090810190601f168015610cea5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a15b5b5b505050565b600060206040519081016040528060008152506000600484815481101561000057906000526020600020900160005b905461010091820a9004600160a060020a031660008181526005602090815260409182902080548351600260018316159097026000190190911695909504601f81018390048302860183019093528285529294508493918391830182828015610dda5780601f10610daf57610100808354040283529160200191610dda565b820191906000526020600020905b815481529060010190602001808311610dbd57829003601f168201915b50505050509050925092505b50915091565b60025481565b60408051808201825260008082526020808301829052835180850185528281528082018390528451808601909552828552908401829052909283610e35886114b4565b9350610e76604060405190810160405280600181526020017f0a000000000000000000000000000000000000000000000000000000000000008152506114b4565b9250610e88848463ffffffff6114e416565b9150610ea3610e96876114b4565b839063ffffffff61150b16565b15610eb15760009450610ef4565b610ed1610ecc610ec7868663ffffffff6114e416565b6115bc565b61162a565b9050600160a060020a0380821690881614610eef5760009450610ef4565b600194505b5b505050509392505050565b33600160a060020a038116600090815260076020526040902054801515610f2657610000565b8030600160a060020a0316311015610f3d57610000565b600160a060020a0382166000818152600760205260408082208290555183156108fc0291849190818181858888f19350505050151561077057600160a060020a03821660009081526007602052604090208190555b5b5050565b600481815481101561000057906000526020600020900160005b915054906101000a9004600160a060020a031681565b6004545b90565b60408051602081019091526000815261107a610fe9836114b4565b61105d611069610ff8876114b4565b61105d606060405190810160405280602381526020017f68747470733a2f2f676973742e67697468756275736572636f6e74656e742e6381526020017f6f6d2f00000000000000000000000000000000000000000000000000000000008152506114b4565b9063ffffffff61178516565b6114b4565b9063ffffffff61178516565b90505b92915050565b60035481565b600080548190600160a060020a031615156110aa576110a86000611806565b505b600060009054906101000a9004600160a060020a0316600160a060020a03166338cc48316000604051602001526040518163ffffffff1660e060020a028152600401809050602060405180830381600087803b156100005760325a03f11561000057505060408051805160018054600160a060020a031916600160a060020a039283161790819055600060209384015283517f2ef3accc00000000000000000000000000000000000000000000000000000000815260248101899052600481019485528a5160448201528a51919092169450632ef3accc938a938993919283926064019186019080838382156111bb575b8051825260208311156111bb57601f19909201916020918201910161119b565b505050905090810190601f1680156111e75780820380516001836020036101000a031916815260200191505b509350505050602060405180830381600087803b156100005760325a03f11561000057505060405151915050670de0b6b3a76400003a8402018111156112305760009150611398565b600160009054906101000a9004600160a060020a0316600160a060020a031663c51be90f8260008888886000604051602001526040518663ffffffff1660e060020a0281526004018085815260200180602001806020018481526020018381038352868181518152602001915080519060200190808383600083146112d0575b8051825260208311156112d057601f1990920191602091820191016112b0565b505050905090810190601f1680156112fc5780820380516001836020036101000a031916815260200191505b508381038252855181528551602091820191870190808383821561133b575b80518252602083111561133b57601f19909201916020918201910161131b565b505050905090810190601f1680156113675780820380516001836020036101000a031916815260200191505b5096505050505050506020604051808303818588803b156100005761235a5a03f11561000057505060405151935050505b5b509392505050565b60008054600160a060020a031615156113c0576113be6000611806565b505b600060009054906101000a9004600160a060020a0316600160a060020a03166338cc48316000604051602001526040518163ffffffff1660e060020a028152600401809050602060405180830381600087803b156100005760325a03f11561000057505060408051805160018054600160a060020a031916600160a060020a0392831617908190556000602093840181905284517fc281d19e000000000000000000000000000000000000000000000000000000008152945191909216945063c281d19e9360048082019493918390030190829087803b156100005760325a03f115610000575050604051519150505b5b90565b60408051808201825260008082526020918201528151808301909252825182528281019082018190525b50919050565b604080518082019091526000808252602082015261150383838361190a565b505b92915050565b6000600060006000600060006000600060008a6000015197508a600001518a60000151101561153957895197505b8a60200151965089602001519550600094505b878510156115a65786518651909450925082841461158d5750506000196008602088900385010260020a011981811683821603801561158d578098506115ae565b5b6020870196506020860195505b60208501945061154c565b89518b510398505b505050505050505092915050565b60206040519081016040528060008152506020604051908101604052806000815250600083600001516040518059106115f25750595b908082528060200260200182016040525b50915060208201905061161f8185602001518660000151611985565b8192505b5050919050565b60408051602081019091526000908190528181808060025b602a8110156117775761010084029350848181518110156100005790602001015160f860020a900460f860020a0260f860020a900492508481600101815181101561000057016020015160f860020a9081900481020491506061600160a060020a038416108015906116be5750606683600160a060020a031611155b156116ce576057830392506116fe565b603083600160a060020a0316101580156116f25750603983600160a060020a031611155b156116fe576030830392505b5b606182600160a060020a0316101580156117235750606682600160a060020a031611155b1561173357605782039150611763565b603082600160a060020a0316101580156117575750603982600160a060020a031611155b15611763576030820391505b5b818360100201840193505b600201611642565b8395505b5050505050919050565b604080516020818101835260008083528351918201845280825284518651945193949293919201908059106117b75750595b908082528060200260200182016040525b5091506020820190506117e48186602001518760000151611985565b8451602085015185516117fa9284019190611985565b8192505b505092915050565b60006000611827731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed6119ce565b111561185b575060008054600160a060020a031916731d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed1790556001611905565b600061187a73c03a2615d5efaf5f49f60b7bb6583eaec212fdf16119ce565b11156118ae575060008054600160a060020a03191673c03a2615d5efaf5f49f60b7bb6583eaec212fdf11790556001611905565b60006118cd7351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa6119ce565b1115611901575060008054600160a060020a0319167351efaf4c8b3c9afbd5ab9f4bbc82784ab6ef8faa1790556001611905565b5060005b919050565b604080518082019091526000808252602080830182905285518682015186519287015161193793906119d6565b602080870180519186019190915280518203855286519051919250018114156119635760008552611979565b8351835186519101900385528351810160208601525b8291505b509392505050565b60005b602082106119aa5782518452602093840193909201915b602082039150611988565b6001826020036101000a039050801983511681855116818117865250505b50505050565b803b5b919050565b600080808080888711611a695760208711611a2d5760018760200360080260020a031980875116888b038a018a96505b818388511614611a22576001870196819010611a06578b8b0196505b505050839450611a71565b8686209150879350600092505b8689038311611a69575085832081811415611a5757839450611a71565b6001840193505b600190920191611a3a565b5b5b88880194505b505050509493505050505600a165627a7a72305820db1b192ca1b8c05409600254b27f9a85d0608c07888155c08705500f3ffbe12f0029",
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
    "updated_at": 1489718594373,
    "links": {},
    "address": "0xf0153ef4514b183f0b70e0ac392dc6f9a5e19ac9"
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
