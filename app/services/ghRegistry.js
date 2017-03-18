import Web3 from 'web3';

import GHRegistry from 'contracts/GHRegistry.sol';

import truffleConfig from '../../truffle.js';

let defaultWeb3Location = `http://${truffleConfig.rpc.host}:${truffleConfig.rpc.port}`;

let web3Provided;

if (typeof web3 !== 'undefined') {
  // Use wallet provider i.e. Metamask/Mist
  web3Provided = new Web3(web3.currentProvider);
} else {
  // No web3 detected. Default to Truffle rpc host and port
  web3Provided = new Web3(new Web3.providers.HttpProvider(defaultWeb3Location));
}

GHRegistry.setProvider(web3Provided.currentProvider);

// Promisify web3.eth.getAccounts
web3Provided.eth.getAccountsPromise = function() {
  return new Promise((resolve, reject) => {
    web3Provided.eth.getAccounts((err, accounts) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(accounts);
      }
    });
  });
};

let ex = {
  ghRegistry: GHRegistry.deployed(),
  web3: web3Provided
};

module.exports = ex;
