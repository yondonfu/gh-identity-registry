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
    </Dialog>
  );
};

export default RegisterUsername;
