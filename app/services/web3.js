// import Web3 from 'web3';
import { Connect } from 'uport-connect';

module.exports.loadWeb3 = function() {
  const defaultWeb3Location = 'http://localhost:8545';

  let web3Provided;

  if (typeof web3 !== 'undefined') {
    // Use Metamask/Misk
    web3Provided = new Web3(web3.currentProvider);
  } else {
    // Use fallback i.e. local node
    web3Provided = new Web3(new Web3.providers.HttpProvider(defaultWeb3Location));
  }

  // const uport = new Connect('GHRegistry');

  // const web3Provided = uport.getWeb3();

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

  return web3Provided;
};
