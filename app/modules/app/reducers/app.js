import { combineReducers } from 'redux';

import {
  GET_ACCOUNT,
  GET_ACCOUNT_SUCCESS,
  GET_ACCOUNT_FAILURE,
  REQUEST_USERNAME,
  RECEIVE_USERNAME,
  REQUEST_NETWORK,
  RECEIVE_NETWORK,
  REQUEST_COLLATERAL,
  RECEIVE_COLLATERAL,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAILURE,
  TOGGLE_DRAWER
} from '../actions/app';

const currentAccount = (state = {
  accountPending: false,
  account: '',
  balance: 0,
  collateral: 0
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
      account: action.account,
      balance: action.balance
    };
  case GET_ACCOUNT_FAILURE:
    return {
      ...state,
      accountPending: false,
      account: '',
      balance: 0
    };
  case REQUEST_COLLATERAL:
    return {
      ...state
    };
  case RECEIVE_COLLATERAL:
    return {
      ...state,
      collateral: action.collateral
    };
  case WITHDRAW_SUCCESS:
    return {
      ...state,
      balance: state.balance + state.collateral,
      collateral: 0
    };
  case WITHDRAW_FAILURE:
    return {
      ...state
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

const drawer = (state = {
  openDrawer: false,
  networkName: ''
}, action) => {
  switch (action.type) {
  case TOGGLE_DRAWER:
    return {
      ...state,
      openDrawer: !state.openDrawer
    };
  case REQUEST_NETWORK:
    return {
      ...state
    };
  case RECEIVE_NETWORK:
    return {
      ...state,
      networkName: action.networkName
    };
  default:
    return state;
  }
};

const app = combineReducers({
  currentAccount,
  currentUsername,
  drawer
});

export default app;
