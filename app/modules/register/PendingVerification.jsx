import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const PendingVerification = ({ current, txId, account, targetUsername, handleClosePendingVerification }) => {
  const actions = [
    <RaisedButton
      label="Ok"
      onTouchTap={handleClosePendingVerification}
    />
  ];

  return (
    <div>
      <Dialog
        title="Pending Verification"
        actions={actions}
        modal={false}
        open={current}
      >
        <p>
          Transaction ID: {txId}
        </p>
        <p>
          ETH Address: {account}
        </p>
        <p>
          Username: {targetUsername}
        </p>
      </Dialog>
    </div>
  );
};

export default PendingVerification;
