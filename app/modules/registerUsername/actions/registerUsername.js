import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const REGISTER_USERNAME = 'REGISTER_USERNAME';
export const REGISTER_USERNAME_SUCCESS = 'REGISTER_USERNAME_SUCCESS';
export const REGISTER_USERNAME_FAILURE = 'REGISTER_USERNAME_FAILURE';
export const CHANGE_USERNAME = 'CHANGE_USERNAME';
export const CHANGE_GIST = 'CHANGE_GIST';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';

export const registerUsername = (username, ethAddress) => ({
  type: REGISTER_USERNAME,
  username
});

export const registerUsernameSuccess = () => ({
  type: REGISTER_USERNAME_SUCCESS
});

export const registerUsernameFailure = () => ({
  type: REGISTER_USERNAME_FAILURE
});

export const verifyUsername = (username, gistPath) => dispatch => {
  dispatch(registerUsername);

  web3.eth.getAccounts((err, accounts) => {
    if (err != null || accounts.length == 0) {
      alert('There was an error fetching your account. Make sure your Ethereum client is configured properly');
      dispatch(registerUsernameFailure);
    }

    let account = accounts[0];

    console.log(account);

    let e = ghRegistry.VerifyUsernameComplete({});

    e.watch((err, res) => {
      e.stopWatching();

      if (res.args.success) {
        dispatch(registerUsernameSuccess);
      } else {
        dispatch(registerUsernameFailure);
      }
    });

    ghRegistry.verifyUsername(username, gistPath, {from: account, value: web3.toWei(1, 'ether'), gas: 250000}).then(txId => {
      console.log(txId);
    });
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

export const openDialog = () => ({
  type: OPEN_DIALOG,
  openDialog: true
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
  openDialog: false
});
