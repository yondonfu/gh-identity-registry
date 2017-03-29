import {
  COLLATERAL_SUCCESS,
  COLLATERAL_FAILURE,
  INIT_WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_FAILURE
} from '../actions/withdraw';

const withdraw = (state = {
  pending: false,
  collateral: 0
}, action) => {
  switch (action.type) {
  case COLLATERAL_SUCCESS:
    return {
      ...state,
      collateral: action.collateral
    };
  case COLLATERAL_FAILURE:
    return {
      ...state
    };
  case INIT_WITHDRAW:
    return {
      ...state,
      pending: true
    };
  case WITHDRAW_SUCCESS:
    return {
      ...state,
      pending: false,
      collateral: 0
    };
  case WITHDRAW_FAILURE:
    return {
      ...state,
      pending: false
    };
  default:
    return state;
  }
};

export default withdraw;
