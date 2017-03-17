import { ghRegistry, web3, account } from '../../../services/ghRegistry';

export const REGISTER_USERNAME = 'REGISTER_USERNAME';
export const REGISTER_USERNAME_SUCCESS = 'REGISTER_USERNAME_SUCCESS';
export const REGISTER_USERNAME_FAILURE = 'REGISTER_USERNAME_FAILURE';

export const registerUsername = (username, ethAddress) => ({
  type: REGISTER_USERNAME,
  username: username,
  ethAddress: ethAddress
});

export const registerUsernameSuccess = () => ({
  type: REGISTER_USERNAME_SUCCESS
});

export const registerUsernameFailure = () => ({
  type: REGISTER_USERNAME_FAILURE
});

export const verifyUsername = (username, gistPath) => dispatch => {
  dispatch(registerUsername);

  let e = ghRegistry.VerifyIdentityComplete({});

  e.watch((err, res) => {
    e.stopWatching();

    if (res.args.success) {
      dispatch(registerUsernameSuccess);
    } else {
      dispatch(registerUsernameFailure);
    }
  });

  ghRegistry.verifyUsername(username, gistPath, {from: account, value: web3.toWei(1, 'ether')}).then(txId => {
    console.log(txId);
  });
}
