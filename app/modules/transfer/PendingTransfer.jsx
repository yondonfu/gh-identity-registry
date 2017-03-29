import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const PendingTransfer = ({ open, txId, account, newOwner, handleClose }) => {
  const actions = [
    <RaisedButton
      label="Ok"
      onTouchTap={handleClose}
    />
  ];

  return (
    <div>
      <Dialog
        title="Pending Transfer"
        actions={actions}
        modal={false}
        open={open}
      >
        <p>
          Transaction ID: {txId}
        </p>
        <p>
          ETH Address: {account}
        </p>
        <p>
          New Owner: {newOwner}
        </p>
      </Dialog>
    </div>
  );
};

export default PendingTransfer;
