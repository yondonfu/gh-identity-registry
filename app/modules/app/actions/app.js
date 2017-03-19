import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const GET_ACCOUNT = 'GET_ACCOUNT';
export const GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS';
export const GET_ACCOUNT_FAILURE = 'GET_ACCOUNT_FAILURE';
export const REQUEST_USERNAME = 'REQUEST_USERNAME';
export const RECEIVE_USERNAME = 'RECEIVE_USERNAME';

export const getAccount = () => ({
  type: GET_ACCOUNT
});

export const getAccountSuccess = account => ({
  type: GET_ACCOUNT_SUCCESS,
  account
});

export const getAccountFailure = () => ({
  type: GET_ACCOUNT_FAILURE
});

export const fetchAccount = () => dispatch => {
  dispatch(getAccount());

  return web3.eth.getAccountsPromise().then(accounts => {
    dispatch(getAccountSuccess(accounts[0]));
  }, err => {
    dispatch(getAccountFailure());
    throw err;
  });
};

export const requestUsername = () => ({
  type: REQUEST_USERNAME
});

export const receiveUsername = username => ({
  type: RECEIVE_USERNAME,
  username
});

export const fetchUsername = account => dispatch => {
  dispatch(requestUsername());

  return ghRegistry.registry.call(account).then(username => {
    dispatch(receiveUsername(username));
  });
};

export const fetchAccountAndUsername = () => (dispatch, getState) => {
  return dispatch(fetchAccount()).then(() => {
    const fetchedAccount = getState().app.currentAccount.account;

    return dispatch(fetchUsername(fetchedAccount));
  });
};
