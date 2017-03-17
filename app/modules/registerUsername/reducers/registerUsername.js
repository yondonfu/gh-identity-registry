import {
  REGISTER_USERNAME,
  REGISTER_USERNAME_SUCCESS,
  REGISTER_USERNAME_FAILURE
} from '../actions/registerUsername';

const registerUsername = (state = {
  pending: false,
  username: null,
  ethAddress: null
}, action) => {
  switch (action.type) {
  case REGISTER_USERNAME:
    return {
      pending: true,
      username: action.username,
      ethAddress: action.ethAddress
    };
  case REGISTER_USERNAME_SUCCESS:
    return {
      pending: false,
      username: null,
      ethAddress: null
    };
  case REGISTER_USERNAME_FAILURE:
    return {
      pending: false,
      username: null,
      ethAddress: null
    };
  default:
    return state;
  }
};

export default registerUsername;
