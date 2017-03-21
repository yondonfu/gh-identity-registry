const GHRegistry = artifacts.require('GHRegistry.sol');
const usingOraclize = artifacts.require('usingOraclize.sol');
const strings = artifacts.require('strings.sol');

module.exports = function(deployer, network) {
  let overwrite = false;

  if (network == 'development') {
    overwrite = true;
  }

  deployer.deploy(usingOraclize, {overwrite: overwrite});
  deployer.deploy(strings, {overwrite: overwrite});
  deployer.link(strings, GHRegistry);
  deployer.deploy(GHRegistry, 1000000000000000000, 250000, {overwrite: overwrite});
};
