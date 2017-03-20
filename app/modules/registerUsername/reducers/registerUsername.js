import {
  REGISTER_USERNAME,
  REGISTER_USERNAME_SUCCESS,
  REGISTER_USERNAME_FAILURE,
  CHANGE_USERNAME,
  CHANGE_GIST,
  OPEN_REGISTER_DIALOG,
  CLOSE_REGISTER_DIALOG,
  RESET_REGISTER_USERNAME_ERROR
} from '../actions/registerUsername';

const registerUsername = (state = {
  pending: false,
  targetUsername: '',
  gist: '',
  openDialog: false,
  error: ''
}, action) => {
  switch (action.type) {
  case REGISTER_USERNAME:
    return {
      ...state,
      pending: true
    };
  case REGISTER_USERNAME_SUCCESS:
    return {
      ...state,
      pending: false,
      targetUsername: '',
      gist: ''
    };
  case REGISTER_USERNAME_FAILURE:
    return {
      ...state,
      pending: false,
      targetUsername: '',
      gist: '',
      error: action.error
    };
  case CHANGE_USERNAME:
    return {
      ...state,
      targetUsername: action.targetUsername
    };
  case CHANGE_GIST:
    return {
      ...state,
      gist: action.gist
    };
  case OPEN_REGISTER_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  case CLOSE_REGISTER_DIALOG:
    return {
      ...state,
      openDialog: action.openDialog
    };
  case RESET_REGISTER_USERNAME_ERROR:
    return {
      ...state,
      error: ''
    };
  default:
    return state;
  }
};

export default registerUsername;
