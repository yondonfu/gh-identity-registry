import { fetchInfo } from '../../app/actions/app';
import { fetchRegistry } from '../../registry/actions/registry';

export const OPEN_CREATE_GIST = 'OPEN_CREATE_GIST';
export const CLOSE_CREATE_GIST = 'CLOSE_CREATE_GIST';

export const OPEN_VERIFY_USERNAME = 'OPEN_VERIFY_USERNAME';
export const CLOSE_VERIFY_USERNAME = 'CLOSE_VERIFY_USERNAME';

export const CREATE_PENDING_VERIFICATION = 'START_VERIFY_USERNAME';
export const VERIFY_USERNAME_SUCCESS = 'VERIFY_USERNAME_SUCCESS';
export const VERIFY_USERNAME_FAILURE = 'VERIFY_USERNAME_FAILURE';

export const CHANGE_TARGET_USERNAME = 'CHANGE_TARGET_USERNAME';
export const CHANGE_GIST = 'CHANGE_GIST';

export const OPEN_PENDING_VERIFICATION = 'OPEN_PENDING_VERIFICATION';
export const CLOSE_PENDING_VERIFICATION = 'CLOSE_PENDING_VERIFICATION';

export const OPEN_REGISTERED_USERNAME = 'OPEN_REGISTERED_USERNAME';
export const CLOSE_REGISTERED_USERNAME = 'CLOSE_REGISTERED_USERNAME';

// Create gist actions

export const openCreateGist = () => ({
  type: OPEN_CREATE_GIST
});

export const closeCreateGist = () => ({
  type: CLOSE_CREATE_GIST
});

// Verify username actions

export const openVerifyUsername = () => ({
  type: OPEN_VERIFY_USERNAME
});

export const closeVerifyUsername = () => ({
  type: CLOSE_VERIFY_USERNAME
});

export const createPendingVerification = (txId, account, targetUsername) => ({
  type: CREATE_PENDING_VERIFICATION,
  txId,
  account,
  targetUsername
});

export const verifyUsernameSuccess = () => ({
  type: VERIFY_USERNAME_SUCCESS
});

export const verifyUsernameFailure = () => ({
  type: VERIFY_USERNAME_FAILURE
});

const REGISTER_GAS = 500000;

export const submitVerifyUsername = () => ({ web3, GHRegistry }) => (dispatch, getState) => {
  const account = getState().app.account;
  const targetUsername = getState().register.verifyUsername.targetUsername;
  const gist = getState().register.verifyUsername.gist;

  const prefix = 'https://gist.githubusercontent.com/' + targetUsername;

  const gistPath = gist.slice(prefix.length);

  GHRegistry.deployed().then(instance => {
    const e = instance.VerifyUsernameComplete({});

    e.watch((err, res) => {
      if (res.args.success) {
        dispatch(verifyUsernameSuccess());
        dispatch(closePendingVerification());
        dispatch(fetchInfo());
        dispatch(fetchRegistry());
      } else {
        dispatch(verifyUsernameFailure());
        dispatch(closePendingVerification());
      }
    });
  });

  return GHRegistry.deployed().then(instance => {
    return instance.verifyUsername(targetUsername, gistPath, {from: account, value: web3.toWei(1, 'ether'), gas: REGISTER_GAS}).then(result => {
      if (result.receipt['gasUsed'] == REGISTER_GAS) {
        dispatch(verifyUsernameFailure());
      } else {
        dispatch(createPendingVerification(result.receipt['transactionHash'], account, targetUsername));
      }
    });
  }, err => {
    dispatch(verifyUsernameFailure());
    throw err;
  });
};

export const openPendingVerification = () => ({
  type: OPEN_PENDING_VERIFICATION
});

export const closePendingVerification = () => ({
  type: CLOSE_PENDING_VERIFICATION
});

export const changeTargetUsername = targetUsername => ({
  type: CHANGE_TARGET_USERNAME,
  targetUsername
});

export const changeGist = gist => ({
  type: CHANGE_GIST,
  gist
});

export const openRegisteredUsername = () => ({
  type: OPEN_REGISTERED_USERNAME
});

export const closeRegisteredUsername = () => ({
  type: CLOSE_REGISTERED_USERNAME
});
