import { GHRegistry, web3 } from '../../../services/ghRegistry';
import { fetchCurrentInfo } from '../../app/actions/app';
import { fetchRegistry } from '../../registry/actions/registry';

export const REGISTER_USERNAME = 'REGISTER_USERNAME';
export const REGISTER_USERNAME_SUCCESS = 'REGISTER_USERNAME_SUCCESS';
export const REGISTER_USERNAME_FAILURE = 'REGISTER_USERNAME_FAILURE';
export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_GIST = 'CHANGE_GIST';
export const OPEN_REGISTER_DIALOG = 'OPEN_REGISTER_DIALOG';
export const CLOSE_REGISTER_DIALOG = 'CLOSE_REGISTER_DIALOG';
export const RESET_REGISTER_USERNAME_ERROR = 'RESET_REGISTER_USERNAME_ERROR';

const REGISTER_GAS = 500000;

export const registerUsername = () => ({
  type: REGISTER_USERNAME
});

export const registerUsernameSuccess = () => ({
  type: REGISTER_USERNAME_SUCCESS
});

export const registerUsernameFailure = () => ({
  type: REGISTER_USERNAME_FAILURE,
  error: 'Username registration failed'
});

export const verifyUsername = (account, targetUsername, gistPath) => dispatch => {
  dispatch(registerUsername());

  // TODO: Fix event watching for Truffle v3

  GHRegistry.deployed().then(instance => {
    let e = instance.VerifyUsernameComplete({});

    e.watch((err, res) => {
      if (res.args.success) {
        dispatch(registerUsernameSuccess());
        dispatch(fetchCurrentInfo());
        dispatch(fetchRegistry());
      } else {
        dispatch(registerUsernameFailure());
        dispatch(fetchCurrentInfo());
      }
    });
  });

  return GHRegistry.deployed().then(instance => {
    return instance.verifyUsername(targetUsername, gistPath, {from: account, value: web3.toWei(1, 'ether'), gas: REGISTER_GAS}).then(result => {
      if (result.receipt['gasUsed'] == REGISTER_GAS) {
        dispatch(registerUsernameFailure());
        dispatch(fetchCurrentInfo());
      }
    });
  }, err => {
    dispatch(registerUsernameFailure());
    throw err;
  });
};

export const resetRegisterUsernameError = () => ({
  type: RESET_REGISTER_USERNAME_ERROR
});

export const changeUsername = (targetUsername) => ({
  type: CHANGE_USERNAME,
  targetUsername
});

export const changeGist = (gist) => ({
  type: CHANGE_GIST,
  gist
});

export const openRegisterDialog = () => ({
  type: OPEN_REGISTER_DIALOG,
  openDialog: true
});

export const closeRegisterDialog = () => ({
  type: CLOSE_REGISTER_DIALOG,
  openDialog: false
});
