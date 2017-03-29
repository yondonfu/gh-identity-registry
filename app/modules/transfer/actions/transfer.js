import { fetchRegistry } from '../../registry/actions/registry';
import { fetchInfo } from '../../app/actions/app';

export const OPEN_NO_USERNAME = 'OPEN_NO_USERNAME';
export const CLOSE_NO_USERNAME = 'CLOSE_NO_USERNAME';
export const CREATE_PENDING_TRANSFER = 'CREATE_PENDING_TRANSFER';
export const OPEN_PENDING_TRANSFER = 'OPEN_PENDING_TRANSFER';
export const CLOSE_PENDING_TRANSFER = 'CLOSE_PENDING_TRANSFER';
export const OPEN_TRANSFER_USERNAME = 'OPEN_TRANSFER_USERNAME';
export const CLOSE_TRANSFER_USERNAME = 'CLOSE_TRANSFER_USERNAME';
export const CHANGE_NEW_OWNER = 'TRANSFER_NEW_OWNER';

export const TRANSFER_SUCCESS = 'TRANSFER_SUCCESS';
export const TRANSFER_FAILURE = 'TRANSFER_FAILURE';

const TRANSFER_GAS = 500000;

export const openTransferUsername = () => ({
  type: OPEN_TRANSFER_USERNAME
});

export const closeTransferUsername = () => ({
  type: CLOSE_TRANSFER_USERNAME
});

export const openNoUsername = () => ({
  type: OPEN_NO_USERNAME
});

export const closeNoUsername = () => ({
  type: CLOSE_NO_USERNAME
});

export const createPendingTransfer = (txId, account, newOwner) => ({
  type: CREATE_PENDING_TRANSFER,
  txId,
  account,
  newOwner
});

export const openPendingTransfer = () => ({
  type: OPEN_PENDING_TRANSFER
});

export const closePendingTransfer = () => ({
  type: CLOSE_PENDING_TRANSFER
});

export const transferSuccess = () => ({
  type: TRANSFER_SUCCESS
});

export const transferFailure = () => ({
  type: TRANSFER_FAILURE
});

export const submitTransfer = () => ({ GHRegistry }) => (dispatch, getState) => {
  dispatch(closeTransferUsername());

  const account = getState().app.account;
  const newOwner = getState().transfer.transferUsername.newOwner;

  return GHRegistry.deployed().then(instance => {
    return instance.transfer(newOwner, {from: account, gas: TRANSFER_GAS}).then(result => {
      if (result.receipt['gasUsed'] == TRANSFER_GAS) {
        dispatch(transferFailure());
      } else {
        dispatch(createPendingTransfer(result.receipt['transactionHash'], account, newOwner));
        dispatch(openPendingTransfer());
        dispatch(transferSuccess());
        dispatch(fetchInfo());
        dispatch(fetchRegistry());
      }
    });
  }, err => {
    dispatch(transferFailure());
    throw err;
  });
};

export const changeNewOwner = newOwner => ({
  type: CHANGE_NEW_OWNER,
  newOwner
});
