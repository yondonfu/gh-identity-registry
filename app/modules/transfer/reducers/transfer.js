import { combineReducers } from 'redux';

import {
  CREATE_PENDING_TRANSFER,
  OPEN_PENDING_TRANSFER,
  CLOSE_PENDING_TRANSFER,
  OPEN_NO_USERNAME,
  CLOSE_NO_USERNAME,
  OPEN_TRANSFER_USERNAME,
  CLOSE_TRANSFER_USERNAME,
  TRANSFER_SUCCESS,
  TRANSFER_FAILURE,
  CHANGE_NEW_OWNER,
} from '../actions/transfer';

const transferUsername = (state = {
  open: false,
  newOwner: ''
}, action) => {
  switch (action.type) {
  case OPEN_TRANSFER_USERNAME:
    return {
      ...state,
      open: true
    };
  case CLOSE_TRANSFER_USERNAME:
    return {
      ...state,
      open: false
    };
  case CHANGE_NEW_OWNER:
    return {
      ...state,
      newOwner: action.newOwner
    };
  default:
    return state;
  }
};

const pendingTransfer = (state = {
  open: false,
  txId: '',
  account: '',
  newOwner: ''
}, action) => {
  switch (action.type) {
  case OPEN_PENDING_TRANSFER:
    return {
      ...state,
      open: true
    };
  case CLOSE_PENDING_TRANSFER:
    return {
      ...state,
      open: false
    };
  case CREATE_PENDING_TRANSFER:
    return {
      ...state,
      txId: action.txId,
      account: action.account,
      newOwner: action.newOwner
    };
  default:
    return state;
  }
};

const noUsername = (state = {
  open: false
}, action) => {
  switch (action.type) {
  case OPEN_NO_USERNAME:
    return {
      ...state,
      open: true
    };
  case CLOSE_NO_USERNAME:
    return {
      ...state,
      open: false
    };
  default:
    return state;
  }
};

const transfer = combineReducers({
  transferUsername,
  pendingTransfer,
  noUsername
});

export default transfer;
