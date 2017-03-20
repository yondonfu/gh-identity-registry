import { ghRegistry, web3 } from '../../../services/ghRegistry';

export const GET_ACCOUNT = 'GET_ACCOUNT';
export const GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS';
export const GET_ACCOUNT_FAILURE = 'GET_ACCOUNT_FAILURE';
export const REQUEST_USERNAME = 'REQUEST_USERNAME';
export const RECEIVE_USERNAME = 'RECEIVE_USERNAME';

export const REQUEST_NETWORK = 'REQUEST_NETWORK';
export const RECEIVE_NETWORK = 'RECEIVE_NETWORK';
export const REQUEST_COLLATERAL = 'REQUEST_COLLATERAL';
export const RECEIVE_COLLATERAL = 'RECEIVE_COLLATERAL';
export const WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS';
export const WITHDRAW_FAILURE = 'WITHDRAW_FAILURE';

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

const WITHDRAW_GAS = 500000;

export const getAccount = () => ({
  type: GET_ACCOUNT
});

export const getAccountSuccess = (account, balance) => ({
  type: GET_ACCOUNT_SUCCESS,
  account,
  balance
});

export const getAccountFailure = () => ({
  type: GET_ACCOUNT_FAILURE
});

export const fetchAccount = () => dispatch => {
  dispatch(getAccount());

  return web3.eth.getAccountsPromise().then(accounts => {
    const account = accounts[0];

    return web3.eth.getBalancePromise(account).then(balance => {
      dispatch(getAccountSuccess(account, web3.fromWei(balance, 'ether').toNumber()));
    });
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

export const requestCollateral = () => ({
  type: REQUEST_COLLATERAL
});

export const receiveCollateral = collateral => ({
  type: RECEIVE_COLLATERAL,
  collateral
});

export const fetchCollateral = account => dispatch => {
  dispatch(requestCollateral());

  return ghRegistry.collaterals.call(account).then(collateral => {
    dispatch(receiveCollateral(web3.fromWei(collateral, 'ether').toNumber()));
  });
};

export const fetchAccountAndUsername = () => (dispatch, getState) => {
  return dispatch(fetchAccount()).then(() => {
    const fetchedAccount = getState().app.currentAccount.account;

    return dispatch(fetchCollateral(fetchedAccount)).then(() => {
      return dispatch(fetchUsername(fetchedAccount));
    });
  });
};

export const requestNetwork = () => ({
  type: REQUEST_NETWORK
});

export const receiveNetwork = networkName => ({
  type: RECEIVE_NETWORK,
  networkName
});

export const fetchNetwork = () => dispatch => {
  dispatch(requestNetwork());

  web3.version.getNetwork((err, netId) => {
    let networkName;

    if (netId == 1) {
      networkName = 'Ethereum Main Net';
    } else if (netId == 2) {
      networkName = 'Morden Test Net';
    } else if (netId == 3) {
      networkName = 'Ropsten Test Net';
    } else {
      networkName = 'Unknown Network';
    }

    dispatch(receiveNetwork(networkName));
  });
};

export const withdrawSuccess = () => ({
  type: WITHDRAW_SUCCESS
});

export const withdrawFailure = () => ({
  type: WITHDRAW_FAILURE
});

export const withdraw = account => dispatch => {
  return ghRegistry.withdrawCollateral({from: account}).then(txId => {
    console.log(txId);

    return web3.eth.checkTransactionReceipt(txId, WITHDRAW_GAS).then(success => {
      dispatch(withdrawSuccess());
    }, err => {
      dispatch(withdrawFailure());
      throw err;
    });
  });
};

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
});
