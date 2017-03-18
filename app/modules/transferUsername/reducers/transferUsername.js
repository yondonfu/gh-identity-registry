import {
  TRANSFER_USERNAME,
  TRANSFER_USERNAME_SUCCESS,
  TRANSFER_USERNAME_FAILURE,
  CHANGE_NEW_OWNER,
  OPEN_DIALOG,
  CLOSE_DIALOG
} from '../actions/transferUsername';

const transferUsername = (state = {
  pending: false,
  newOwner: '',
  openDialog: false
}, action) => {
  switch (action.type) {
  case TRANSFER_USERNAME:
    return {
      pending: true
    };
  case TRANSFER_USERNAME_SUCCESS:
    return {
      pending: false,
      newOwner: ''
    };
  case TRANSFER_USERNAME_FAILURE:
    return {
      pending: false,
      newOwner: ''
    };
  case CHANGE_NEW_OWNER:
    return {
      ...state,
      newOwner: action.newOwner
    };
  case OPEN_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  case CLOSE_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  default:
    return state;
  }
};

export default transferUsername;
