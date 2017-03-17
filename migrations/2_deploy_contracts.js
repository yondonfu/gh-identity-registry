module.exports = function(deployer) {
  deployer.deploy(usingOraclize);
  deployer.deploy(strings);
  deployer.deploy(GHRegistry, 1000000000000000000, 250000);
};
