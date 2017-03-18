import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const TRANSFER_USERNAME = 'TRANSFER_USERNAME';
export const TRANSFER_USERNAME_SUCCESS = 'TRANSFER_USERNAME_SUCCESS';
export const TRANSFER_USERNAME_FAILURE = 'TRANSFER_USERNAME_FAILURE';
export const CHANGE_NEW_OWNER = 'TRANSFER_NEW_OWNER';
export const OPEN_TRANSFER_DIALOG = 'OPEN_TRANSFER_DIALOG';
export const CLOSE_TRANSFER_DIALOG = 'CLOSE_TRANSFER_DIALOG';

const TRANSFER_GAS = 500000;

export const transferUsername = newOwner => ({
  type: TRANSFER_USERNAME,
  newOwner
});

export const transferUsernameSuccess = () => ({
  type: TRANSFER_USERNAME_SUCCESS
});

export const transferUsernameFailure = () => ({
  type: TRANSFER_USERNAME_FAILURE
});

export const transfer = (account, newOwner) => dispatch => {
  dispatch(transferUsername(newOwner));

  ghRegistry.transfer(newOwner, {from: account, gas: TRANSFER_GAS}).then(txId => {
    console.log(txId);

    web3.eth.getTransactionReceipt(txId, (err, receipt) => {
      if (receipt['gasUsed'] == TRANSFER_GAS) {
        dispatch(transferUsernameFailure);
      } else {
        dispatch(transferUsernameSuccess);
      }
    });
  });
};

export const changeNewOwner = (newOwner) => ({
  type: CHANGE_NEW_OWNER,
  newOwner
});

export const openTransferDialog = () => ({
  type: OPEN_TRANSFER_DIALOG,
  openDialog: true
});

export const closeTransferDialog = () => ({
  type: CLOSE_TRANSFER_DIALOG,
  openDialog: false
});
