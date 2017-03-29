import { combineReducers } from 'redux';

import {
  OPEN_CREATE_GIST,
  CLOSE_CREATE_GIST,
  OPEN_VERIFY_USERNAME,
  CLOSE_VERIFY_USERNAME,
  VERIFY_USERNAME_SUCCESS,
  VERIFY_USERNAME_FAILURE,
  CHANGE_TARGET_USERNAME,
  CHANGE_GIST,
  CREATE_PENDING_VERIFICATION,
  OPEN_PENDING_VERIFICATION,
  CLOSE_PENDING_VERIFICATION,
  OPEN_REGISTERED_USERNAME,
  CLOSE_REGISTERED_USERNAME
} from '../actions/register';

const createGist = (state = {
  current: false
}, action) => {
  switch (action.type) {
  case OPEN_CREATE_GIST:
    return {
      ...state,
      current: true
    };
  case CLOSE_CREATE_GIST:
    return {
      ...state,
      current: false
    };
  default:
    return state;
  }
};

const verifyUsername = (state = {
  current: false,
  targetUsername: '',
  gist: ''
}, action) => {
  switch (action.type) {
  case OPEN_VERIFY_USERNAME:
    return {
      ...state,
      current: true
    };
  case CLOSE_VERIFY_USERNAME:
    return {
      ...state,
      current: false
    };
  case CHANGE_TARGET_USERNAME:
    return {
      ...state,
      targetUsername: action.targetUsername
    };
  case CHANGE_GIST:
    return {
      ...state,
      gist: action.gist
    };
  default:
    return state;
  }
};

const pendingVerification = (state = {
  current: false,
  txId: '',
  account: '',
  targetUsername: ''
}, action) => {
  switch (action.type) {
  case OPEN_PENDING_VERIFICATION:
    return {
      ...state,
      current: true
    };
  case CLOSE_PENDING_VERIFICATION:
    return {
      ...state,
      current: false
    };
  case CREATE_PENDING_VERIFICATION:
    return {
      ...state,
      txId: action.txId,
      account: action.account,
      targetUsername: action.targetUsername
    };
  case VERIFY_USERNAME_SUCCESS:
    return {
      ...state,
      txId: '',
      account: '',
      targetUsername: ''
    };
  case VERIFY_USERNAME_FAILURE:
    return {
      ...state,
      txId: '',
      account: '',
      targetUsername: ''
    };
  default:
    return state;
  }
};

const registeredUsername = (state = {
  current: false
}, action) => {
  switch (action.type) {
  case OPEN_REGISTERED_USERNAME:
    return {
      ...state,
      current: true
    };
  case CLOSE_REGISTERED_USERNAME:
    return {
      ...state,
      current: false
    };
  default:
    return state;
  }
}

const register = combineReducers({
  createGist,
  verifyUsername,
  pendingVerification,
  registeredUsername
});

export default register;
