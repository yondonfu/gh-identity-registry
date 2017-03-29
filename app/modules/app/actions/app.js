export const REQUEST_INFO = 'REQUEST_INFO';
export const RECEIVE_INFO = 'RECEIVE_INFO';
export const ACCOUNT_SUCCESS = 'ACCOUNT_SUCCESS';
export const ACCOUNT_FAILURE = 'ACCOUNT_FAILURE';
export const USERNAME_SUCCESS = 'USERNAME_SUCCESS';
export const USERNAME_FAILURE = 'USERNAME_FAILURE';
export const NETWORK_SUCCESS = 'NETWORK_SUCCESS';
export const NETWORK_FAILURE = 'NETWORK_FAILURE';
export const CONTRACT_ADDRESS_SUCCESS = 'CONTRACT_ADDRESS_SUCCESS';
export const CONTRACT_ADDRESS_FAILURE = 'CONTRACT_ADDRESS_FAILURE';
export const COLLATERAL_SUCCESS = 'COLLATERAL_SUCCESS';
export const COLLATERAL_FAILURE = 'COLLATERAL_FAILURE';
export const INIT_WITHDRAW = 'INIT_WITHDRAW';
export const WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS';
export const WITHDRAW_FAILURE = 'WITHDRAW_FAILURE';

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export const requestInfo = () => ({
  type: REQUEST_INFO
});

export const receiveInfo = () => ({
  type: RECEIVE_INFO
});

export const accountSuccess = (account, balance) => ({
  type: ACCOUNT_SUCCESS,
  account,
  balance
});

export const accountFailure = () => ({
  type: ACCOUNT_FAILURE
});

export const fetchAccount = () => ({ web3 }) => dispatch => {
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

export const fetchUsername = account => ({ GHRegistry }) => dispatch => {
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

export const networkSuccess = networkName => ({
  type: NETWORK_SUCCESS,
  networkName
});

export const networkFailure = () => ({
  type: NETWORK_FAILURE
});

export const fetchNetwork = () => ({ web3 }) => dispatch => {
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

export const contractAddressSuccess = contractAddress => ({
  type: CONTRACT_ADDRESS_SUCCESS,
  contractAddress
});

export const contractAddressFailure = () => ({
  type: CONTRACT_ADDRESS_FAILURE
});

export const fetchContractAddress = () => ({ GHRegistry }) => dispatch => {
  return GHRegistry.deployed().then(instance => {
    dispatch(contractAddressSuccess(instance.address));
  }, err => {
    dispatch(contractAddressFailure());
    throw err;
  });
};

export const fetchInfo = () => () => (dispatch, getState) => {
  return dispatch(fetchNetwork()).then(() => {
    return dispatch(fetchContractAddress());
  }).then(() => {
    return dispatch(fetchAccount());
  }).then(() => {
    const fetchedAccount = getState().app.account;

    return dispatch(fetchUsername(fetchedAccount));
  }).then(() => {
    return dispatch(fetchCollateral());
  });
};

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
});

const WITHDRAW_GAS = 500000;

export const collateralSuccess = collateral => ({
  type: COLLATERAL_SUCCESS,
  collateral
});

export const collateralFailure = () => ({
  type: COLLATERAL_FAILURE
});

export const fetchCollateral = () => ({ web3, GHRegistry }) => (dispatch, getState) => {
  const account = getState().app.account;

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

export const initWithdraw = () => ({
  type: INIT_WITHDRAW
});

export const withdrawSuccess = () => ({
  type: WITHDRAW_SUCCESS
});

export const withdrawFailure = () => ({
  type: WITHDRAW_FAILURE
});

export const withdraw = () => ({ GHRegistry }) => (dispatch, getState) => {
  const account = getState().app.account;

  dispatch(initWithdraw());

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
