import { ghRegistry } from '../../../services/ghRegistry';
import parseRegistryEntry from '../utils/helpers';

export const REQUEST_REGISTRY = 'REQUEST_REGISTRY';
export const RECEIVE_REGISTRY = 'RECEIVE_REGISTRY';

export const requestRegistry = () => ({
  type: REQUEST_REGISTRY
});

export const receiveRegistry = registryData => ({
  type: RECEIVE_REGISTRY,
  registry: registryData.map(entry => parseRegistryEntry(entry)),
  received_at: Date.now()
});

export const fetchRegistry = () => dispatch => {
  dispatch(requestRegistry);
  console.log(ghRegistry);
  ghRegistry.getRegistrySize.call().then(size => {
    let entries = [...Array(size.toNumber()).keys()].map(i => {
      return ghRegistry.getRegistryEntry.call(i).then(entry => entry);
    });

    Promise.all(entries).then(entries => {
      console.log(entries);
      dispatch(receiveRegistry(entries));
    });
  });
};
