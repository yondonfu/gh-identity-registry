import { GHRegistry } from '../../../services/ghRegistry';
import { parseRegistryEntry } from '../utils/helpers';

export const REQUEST_REGISTRY = 'REQUEST_REGISTRY';
export const RECEIVE_REGISTRY = 'RECEIVE_REGISTRY';

export const requestRegistry = () => ({
  type: REQUEST_REGISTRY
});

export const receiveRegistry = registryData => ({
  type: RECEIVE_REGISTRY,
  entries: registryData.map(entry => parseRegistryEntry(entry)).filter(entry => entry.username.length > 0),
  receivedAt: Date.now()
});

export const fetchRegistry = () => dispatch => {
  dispatch(requestRegistry);

  return GHRegistry.deployed().then(instance => {
    return instance.getRegistrySize.call().then(size => {
      let entries = [...Array(size.toNumber()).keys()].map(i => {
        return instance.getRegistryEntry.call(i).then(entry => entry);
      });

      return Promise.all(entries).then(entries => {
        dispatch(receiveRegistry(entries));
      });
    });
  });
};
