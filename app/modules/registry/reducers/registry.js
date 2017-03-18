import {
  REQUEST_REGISTRY,
  RECEIVE_REGISTRY
} from '../actions/registry';

const registry = (state = {
  pending: false,
  entries: []
}, action) => {
  switch (action.type) {
  case REQUEST_REGISTRY:
    return {
      ...state,
      pending: true
    };
  case RECEIVE_REGISTRY:
    return {
      ...state,
      pending: false,
      entries: action.entries,
      lastUpdated: action.receivedAt
    };
  default:
    return state;
  }
};

export default registry;
