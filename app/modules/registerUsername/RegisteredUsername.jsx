import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const RegisteredUsername = ({
  openDialog,
  account,
  username,
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
      title="Registered Username"
      actions={actions}
      modal={false}
      open={openDialog}
      onRequestClose={handleClose}
    >
      Your ETH account {account} is already registered with the Github username {username}
    </Dialog>
  );
};

export default RegisteredUsername;
