import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const Withdraw = ({ account, username, pending, collateral, handleWithdraw }) => (
  <div>
    <div>
      Username: {username}
    </div>
    <div>
      Withdrawable Collateral: {collateral}
    </div>
    {collateral > 0 &&
     <RaisedButton label="Withdraw Collateral" onTouchTap={handleWithdraw(account)}/>
    }
  </div>
);

export default Withdraw;
