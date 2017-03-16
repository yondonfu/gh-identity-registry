module.exports = function(deployer) {
  deployer.deploy(usingOraclize);
  deployer.deploy(strings);
  deployer.deploy(GHRegistry);
};
