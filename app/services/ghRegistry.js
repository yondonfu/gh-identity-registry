import contract from 'truffle-contract';

import Web3 from 'web3';

import GHRegistryArtifact from 'contracts/GHRegistry.sol';
const GHRegistry = contract(GHRegistryArtifact);

let defaultWeb3Location = 'http://localhost:8545';

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

// Promisify web3.eth.getBalance
web3Provided.eth.getBalancePromise = function(account) {
  return new Promise((resolve, reject) => {
    web3Provided.eth.getBalance(account, (err, balance) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(balance);
      }
    });
  });
};

// Promisify web3.version.getNetwork
web3Provided.version.getNetworkPromise = function() {
  return new Promise((resolve, reject) => {
    web3Provided.version.getNetwork((err, netId) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(netId);
      }
    });
  });
};

// Function to check transaction gas usage
web3Provided.eth.checkTransactionReceipt = function(txId, gasProvided) {
  return new Promise((resolve, reject) => {
    web3Provided.eth.getTransactionReceipt(txId, (err, receipt) => {
      if (err != null || receipt['gasUsed'] == gasProvided) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

let ex = {
  GHRegistry,
  web3: web3Provided
};

module.exports = ex;
