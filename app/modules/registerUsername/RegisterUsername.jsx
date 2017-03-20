import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const RegisterUsername = ({ openDialog, account, targetUsername, gist, handleSubmit, handleClose, handleUsernameChange, handleGistChange }) => {
  const actions = [
    <RaisedButton
      label="Submit"
      onTouchTap={handleSubmit}
    />,
    <RaisedButton
      label="Cancel"
      onTouchTap={handleClose}
    />
  ];

  return (
    <Dialog
      title="Register Username"
      actions={actions}
      autoDetectWindowHeight={true}
      modal={false}
      open={openDialog}
      onRequestClose={handleClose}
    >
      <form>
        <div>
          <TextField
            disabled={true}
            fullWidth={true}
            defaultValue={account}
            floatingLabelText="Account"
          />
        </div>
        <div>
          <TextField
            hintText="Github Username"
            value={targetUsername}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            hintText="Gist URL"
            value={gist}
            onChange={handleGistChange}
          />
        </div>
      </form>
      <div>
          This operation requires posting collateral of 1 ETH. Part of the collateral is used to pay for the Oraclize fee.
          If a Github username is successfully verified, you will be able to withdraw your remaining collateral.
          If a Github username is not successfully verified, your collateral will be lost.
      </div>
    </Dialog>
  );
};

export default RegisterUsername;
