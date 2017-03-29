import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const RegisteredUsername = ({
  current,
  account,
  username,
  handleCloseRegisteredUsername
}) => {
  const actions = [
    <RaisedButton
      label="Ok"
      onTouchTap={handleCloseRegisteredUsername}
    />
  ];

  return (
    <Dialog
      title="Registered Username"
      actions={actions}
      modal={false}
      open={current}
    >
      Your ETH account {account} is already registered with the Github username {username}
    </Dialog>
  );
};

export default RegisteredUsername;
