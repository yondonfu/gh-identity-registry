import contract from 'truffle-contract';
import GHRegistryArtifact from '../../build/contracts/GHRegistry.json';

module.exports.loadGHRegistry = function(web3) {
  const GHRegistry = contract(GHRegistryArtifact);
  GHRegistry.setProvider(web3.currentProvider);
  return GHRegistry;
};
