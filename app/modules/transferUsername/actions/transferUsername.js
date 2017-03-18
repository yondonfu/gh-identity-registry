import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const TRANSFER_USERNAME = 'TRANSFER_USERNAME';
export const TRANSFER_USERNAME_SUCCESS = 'TRANSFER_USERNAME_SUCCESS';
export const TRANSFER_USERNAME_FAILURE = 'TRANSFER_USERNAME_FAILURE';
export const CHANGE_NEW_OWNER = 'TRANSFER_NEW_OWNER';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';

export const transferUsername = () => ({
  type: TRANSFER_USERNAME
});

export const transferUsernameSuccess = () => ({
  type: TRANSFER_USERNAME_SUCCESS
});

export const transferUsernameFailure = () => ({
  type: TRANSFER_USERNAME_FAILURE
});

export const transfer = newOwner => dispatch => {
  dispatch(transferUsername);

  web3.eth.getAccounts((err, accounts) => {
    if (err != null || accounts.length == 0) {
      alert('There was an error fetching your account. Make sure your Ethereum client is configured properly');
      dispatch(transferUsernameFailure);
    }

    let account = accounts[0];

    console.log(account);

    ghRegistry.transfer(newOwner, {from: account});
  });
};

export const changeNewOwner = (newOwner) => ({
  type: CHANGE_NEW_OWNER,
  newOwner
});

export const openDialog = () => ({
  type: OPEN_DIALOG,
  openDialog: true
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
  openDialog: false
});
