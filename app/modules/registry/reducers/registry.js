import {
  REQUEST_REGISTRY,
  RECEIVE_REGISTRY
} from '../actions/registry';

const registry = (state = {
  pending: false,
  items: []
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
      items: action.registry,
      lastUpdated: action.receivedAt
    };
  default:
    return state;
  }
};

export default registry;
