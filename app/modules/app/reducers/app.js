import { combineReducers } from 'redux';

import {
  GET_ACCOUNT,
  GET_ACCOUNT_SUCCESS,
  GET_ACCOUNT_FAILURE,
  REQUEST_USERNAME,
  RECEIVE_USERNAME,
} from '../actions/app';

const currentAccount = (state = {
  accountPending: false,
  account: ''
}, action) => {
  switch (action.type) {
  case GET_ACCOUNT:
    return {
      ...state,
      accountPending: true
    };
  case GET_ACCOUNT_SUCCESS:
    return {
      ...state,
      accountPending: false,
      account: action.account
    };
  case GET_ACCOUNT_FAILURE:
    return {
      ...state,
      accountPending: false,
      account: ''
    };
  default:
    return state;
  }
};

const currentUsername = (state = {
  usernamePending: false,
  username: ''
}, action) => {
  switch (action.type) {
  case REQUEST_USERNAME:
    return {
      ...state,
      usernamePending: true
    };
  case RECEIVE_USERNAME:
    return {
      ...state,
      usernamePending: false,
      username: action.username
    };
  default:
    return state;
  }
};

const app = combineReducers({
  currentAccount,
  currentUsername
});

export default app;
