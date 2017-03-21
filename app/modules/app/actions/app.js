import { GHRegistry, web3 } from '../../../services/ghRegistry';

export const REQUEST_CURRENT_INFO = 'REQUEST_CURRENT_INFO';
export const RECEIVE_CURRENT_INFO = 'RECEIVE_CURRENT_INFO';
export const ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS';
export const ACCOUNT_FAILURE = 'GET_ACCOUNT_FAILURE';
export const USERNAME_SUCCESS = 'USERNAME_SUCCESS';
export const USERNAME_FAILURE = 'USERNAME_FAILURE';
export const NETWORK_SUCCESS = 'NETWORK_SUCCESS';
export const NETWORK_FAILURE = 'NETWORK_FAILURE';
export const COLLATERAL_SUCCESS = 'COLLATERAL_SUCCESS';
export const COLLATERAL_FAILURE = 'COLLATERAL_FAILURE';
export const WITHDRAW_START = 'WITHDRAW_START';
export const WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS';
export const WITHDRAW_FAILURE = 'WITHDRAW_FAILURE';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

const WITHDRAW_GAS = 500000;

export const requestCurrentInfo = () => ({
  type: REQUEST_CURRENT_INFO
});

export const receiveCurrentInfo = () => ({
  type: RECEIVE_CURRENT_INFO
});

export const accountSuccess = (account, balance) => ({
  type: ACCOUNT_SUCCESS,
  account,
  balance
});

export const accountFailure = () => ({
  type: ACCOUNT_FAILURE
});

export const fetchAccount = () => dispatch => {
  return web3.eth.getAccountsPromise().then(accounts => {
    const account = accounts[0];

    return web3.eth.getBalancePromise(account).then(balance => {
      const ethBalance = web3.fromWei(balance, 'ether').toNumber();

      dispatch(accountSuccess(account, ethBalance));
    });
  }, err => {
    dispatch(accountFailure());
    throw err;
  });
};

export const usernameSuccess = username => ({
  type: USERNAME_SUCCESS,
  username
});

export const usernameFailure = () => ({
  type: USERNAME_FAILURE
});

export const fetchUsername = account => dispatch => {
  return GHRegistry.deployed().then(instance => {
    return instance.registry.call(account).then(username => {
      dispatch(usernameSuccess(username));
    }, err => {
      dispatch(usernameFailure());
      throw err;
    });
  }, err => {
    dispatch(usernameFailure());
    throw err;
  });
};

export const collateralSuccess = collateral => ({
  type: COLLATERAL_SUCCESS,
  collateral
});

export const collateralFailure = () => ({
  type: COLLATERAL_FAILURE
});

export const fetchCollateral = account => dispatch => {
  return GHRegistry.deployed().then(instance => {
    return instance.collaterals.call(account).then(collateral => {
      const ethCollateral = web3.fromWei(collateral, 'ether').toNumber();

      dispatch(collateralSuccess(ethCollateral));
    }, err => {
      dispatch(collateralFailure());
      throw err;
    });
  }, err => {
    dispatch(collateralFailure());
    throw err;
  });
};

export const networkSuccess = networkName => ({
  type: NETWORK_SUCCESS,
  networkName
});

export const networkFailure = () => ({
  type: NETWORK_FAILURE
});

export const fetchNetwork = () => dispatch => {
  return web3.version.getNetworkPromise().then(netId => {
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

    dispatch(networkSuccess(networkName));
  }, err => {
    dispatch(networkFailure());
    throw err;
  });
};

export const fetchCurrentInfo = () => (dispatch, getState) => {
  return dispatch(fetchAccount()).then(() => {
    const fetchedAccount = getState().app.account;

    return dispatch(fetchCollateral(fetchedAccount)).then(() => {
      return dispatch(fetchUsername(fetchedAccount)).then(() => {
        return dispatch(fetchNetwork());
      });
    });
  });
};

export const withdrawStart = () => ({
  type: WITHDRAW_START
});

export const withdrawSuccess = () => ({
  type: WITHDRAW_SUCCESS
});

export const withdrawFailure = () => ({
  type: WITHDRAW_FAILURE
});

export const withdraw = account => dispatch => {
  dispatch(withdrawStart());

  return GHRegistry.deployed().then(instance => {
    return instance.withdrawCollateral({from: account, gas: WITHDRAW_GAS}).then(result => {
      if (result.receipt['gasUsed'] == WITHDRAW_GAS) {
        dispatch(withdrawFailure());
      } else {
        dispatch(withdrawSuccess());
      }
    });
  }, err => {
    dispatch(withdrawFailure());
    throw err;
  });
};

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
});
