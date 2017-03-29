import {
  REQUEST_INFO,
  RECEIVE_INFO,
  ACCOUNT_SUCCESS,
  ACCOUNT_FAILURE,
  NETWORK_SUCCESS,
  NETWORK_FAILURE,
  CONTRACT_ADDRESS_SUCCESS,
  CONTRACT_ADDRESS_FAILURE,
  USERNAME_SUCCESS,
  USERNAME_FAILURE,
  TOGGLE_DRAWER,
  COLLATERAL_SUCCESS,
  COLLATERAL_FAILURE,
  INIT_WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAILURE
} from '../actions/app';

const app = (state = {
  pending: false,
  networkName: '',
  account: '',
  balance: 0,
  contractAddress: '',
  username: '',
  withdrawPending: false,
  collateral: 0,
  openDrawer: false
}, action) => {
  switch (action.type) {
  case REQUEST_INFO:
    return {
      ...state,
      pending: true
    };
  case RECEIVE_INFO:
    return {
      ...state,
      pending: false
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
  case NETWORK_SUCCESS:
    return {
      ...state,
      networkName: action.networkName
    };
  case NETWORK_FAILURE:
    return {
      ...state
    };
  case CONTRACT_ADDRESS_SUCCESS:
    return {
      ...state,
      contractAddress: action.contractAddress
    };
  case CONTRACT_ADDRESS_FAILURE:
    return {
      ...state
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
  case TOGGLE_DRAWER:
    return {
      ...state,
      openDrawer: !state.openDrawer
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
  case INIT_WITHDRAW:
    return {
      ...state,
      withdrawPending: true
    };
  case WITHDRAW_SUCCESS:
    return {
      ...state,
      balance: state.balance + state.collateral,
      withdrawPending: false,
      collateral: 0
    };
  case WITHDRAW_FAILURE:
    return {
      ...state,
      withdrawPending: false
    };
  default:
    return state;
  }
};

export default app;
