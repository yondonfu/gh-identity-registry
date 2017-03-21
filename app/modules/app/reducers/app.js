import {
  REQUEST_CURRENT_INFO,
  RECEIVE_CURRENT_INFO,
  ACCOUNT_SUCCESS,
  ACCOUNT_FAILURE,
  USERNAME_SUCCESS,
  USERNAME_FAILURE,
  NETWORK_SUCCESS,
  NETWORK_FAILURE,
  COLLATERAL_SUCCESS,
  COLLATERAL_FAILURE,
  WITHDRAW_START,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAILURE,
  TOGGLE_DRAWER
} from '../actions/app';

const app = (state = {
  pending: false,
  account: '',
  balance: 0,
  collateral: 0,
  username: '',
  openDrawer: false,
  withdrawPending: false
}, action) => {
  switch (action.type) {
  case REQUEST_CURRENT_INFO:
    return {
      ...state,
      pending: true
    };
  case ACCOUNT_SUCCESS:
    return {
      ...state,
      account: action.account,
      balance: action.balance
    };
  case ACCOUNT_FAILURE:
    return {
      ...state,
      account: '',
      balance: 0
    };
  case COLLATERAL_SUCCESS:
    return {
      ...state,
      collateral: action.collateral
    };
  case COLLATERAL_FAILURE:
    return {
      ...state
    };
  case WITHDRAW_START:
    return {
      ...state,
      withdrawPending: true
    };
  case WITHDRAW_SUCCESS:
    return {
      ...state,
      withdrawPending: false,
      balance: state.balance + state.collateral,
      collateral: 0
    };
  case WITHDRAW_FAILURE:
    return {
      ...state,
      withdrawPending: false
    };
  case USERNAME_SUCCESS:
    return {
      ...state,
      username: action.username
    };
  case USERNAME_FAILURE:
    return {
      ...state
    };
  case NETWORK_SUCCESS:
    return {
      ...state,
      networkName: action.networkName
    };
  case NETWORK_FAILURE:
    return {
      ...state
    };
  case RECEIVE_CURRENT_INFO:
    return {
      ...state,
      pending: false
    };
  case TOGGLE_DRAWER:
    return {
      ...state,
      openDrawer: !state.openDrawer
    };
  default:
    return state;
  }
};

export default app;
