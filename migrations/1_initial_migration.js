const Migrations = artifacts.require('Migrations.sol');

module.exports = function(deployer, network) {
  let overwrite = false;

  if (network == 'testrpc') {
    overwrite = true;
  }

  deployer.deploy(Migrations, {overwrite: overwrite});
};
