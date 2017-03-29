import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const NoUsername = ({
  open,
  account,
  handleClose
}) => {
  const actions = [
    <RaisedButton
      label="Ok"
      onTouchTap={handleClose}
    />
  ];

  return (
    <Dialog
      title="Not Registered"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
    >
      Your ETH account {account} is not yet registered with a Github username.
    </Dialog>
  );
};

export default NoUsername;
