import {
  REGISTER_USERNAME,
  REGISTER_USERNAME_SUCCESS,
  REGISTER_USERNAME_FAILURE,
  CHANGE_USERNAME,
  CHANGE_GIST,
  OPEN_DIALOG,
  CLOSE_DIALOG
} from '../actions/registerUsername';

const registerUsername = (state = {
  pending: false,
  username: '',
  openDialog: false
}, action) => {
  switch (action.type) {
  case REGISTER_USERNAME:
    return {
      pending: true,
      username: action.username
    };
  case REGISTER_USERNAME_SUCCESS:
    return {
      pending: false,
      username: ''
    };
  case REGISTER_USERNAME_FAILURE:
    return {
      pending: false,
      username: ''
    };
  case CHANGE_USERNAME:
    return {
      ...state,
      username: action.username
    };
  case CHANGE_GIST:
    return {
      ...state,
      gist: action.gist
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

export default registerUsername;
