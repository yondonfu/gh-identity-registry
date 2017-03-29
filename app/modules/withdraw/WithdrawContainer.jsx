import React from 'react';
import { connect } from 'react-redux';

import Withdraw from './Withdraw';
import { fetchCollateral, withdraw } from './actions/withdraw';

class WithdrawContainer extends React.Component {
  componentDidMount() {
    const { account } = this.props;

    if (account) {
      this.props.loadCollateral();
    }
  }

  render() {
    const { username } = this.props;

    return (
      <div>
        <Withdraw {...this.props}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { withdraw } = state;

  const {
    pending,
    collateral
  } = withdraw;

  return {
    pending,
    collateral
  };
};

const mapDispatchToProps = dispatch => ({
  loadCollateral: () => {
    dispatch(fetchCollateral())
  },
  handleWithdraw: account => {
    dispatch(withdraw(account))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawContainer);
