export const COLLATERAL_SUCCESS = 'COLLATERAL_SUCCESS';
export const COLLATERAL_FAILURE = 'COLLATERAL_FAILURE';
export const INIT_WITHDRAW = 'INIT_WITHDRAW';
export const WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS';
export const WITHDRAW_FAILURE = 'WITHDRAW_FAILURE';

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

export const withdraw = account => ({ GHRegistry }) => dispatch => {
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
