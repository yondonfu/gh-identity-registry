import {
  TRANSFER_USERNAME,
  TRANSFER_USERNAME_SUCCESS,
  TRANSFER_USERNAME_FAILURE,
  CHANGE_NEW_OWNER,
  OPEN_TRANSFER_DIALOG,
  CLOSE_TRANSFER_DIALOG
} from '../actions/transferUsername';

const transferUsername = (state = {
  pending: false,
  account: '',
  newOwner: '',
  username: '',
  openDialog: false
}, action) => {
  switch (action.type) {
  case TRANSFER_USERNAME:
    return {
      ...state,
      pending: true
    };
  case TRANSFER_USERNAME_SUCCESS:
    return {
      ...state,
      pending: false,
      newOwner: ''
    };
  case TRANSFER_USERNAME_FAILURE:
    return {
      ...state,
      pending: false,
      newOwner: ''
    };
  case CHANGE_NEW_OWNER:
    return {
      ...state,
      newOwner: action.newOwner
    };
  case OPEN_TRANSFER_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  case CLOSE_TRANSFER_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  default:
    return state;
  }
};

export default transferUsername;
