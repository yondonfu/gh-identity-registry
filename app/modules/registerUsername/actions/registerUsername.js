import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const REGISTER_USERNAME = 'REGISTER_USERNAME';
export const REGISTER_USERNAME_SUCCESS = 'REGISTER_USERNAME_SUCCESS';
export const REGISTER_USERNAME_FAILURE = 'REGISTER_USERNAME_FAILURE';
export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_GIST = 'CHANGE_GIST';
export const OPEN_REGISTER_DIALOG = 'OPEN_REGISTER_DIALOG';
export const CLOSE_REGISTER_DIALOG = 'CLOSE_REGISTER_DIALOG';

const REGISTER_GAS = 500000;

export const registerUsername = () => ({
  type: REGISTER_USERNAME
});

export const registerUsernameSuccess = () => ({
  type: REGISTER_USERNAME_SUCCESS
});

export const registerUsernameFailure = () => ({
  type: REGISTER_USERNAME_FAILURE
});

export const verifyUsername = (account, username, gistPath) => dispatch => {
  dispatch(registerUsername);

  let e = ghRegistry.VerifyUsernameComplete({});

  e.watch((err, res) => {

    if (res.args.success) {
      dispatch(registerUsernameSuccess);
    } else {
      dispatch(registerUsernameFailure);
    }
  });

  ghRegistry.verifyUsername(username, gistPath, {from: account, value: web3.toWei(1, 'ether'), gas: REGISTER_GAS}).then(txId => {
    console.log(txId);
  });
};

export const changeUsername = (username) => ({
  type: CHANGE_USERNAME,
  username
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
