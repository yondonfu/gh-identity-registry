import {
  TRANSFER_USERNAME,
  TRANSFER_USERNAME_SUCCESS,
  TRANSFER_USERNAME_FAILURE
} from '../actions/transferUsername';

const transferUsername = (state = {
  pending: false,
  username: null,
  ethAddress: null
}, action) => {
  switch (action.type) {
  case TRANSFER_USERNAME:
    return {
      pending: true,
      username: action.username,
      oldOwner: action.oldOwner,
      newOwner: action.newOwner
    };
  case TRANSFER_USERNAME_SUCCESS:
    return {
      pending: false,
      username: null,
      oldOwner: null,
      newOwner: null
    };
  case TRANSFER_USERNAME_FAILURE:
    return {
      pending: false,
      username: null,
      oldOwner: null,
      newOwner: null
    };
  default:
    return state;
  }
};

export default transferUsername;
