import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const RegisterUsername = ({ openDialog, username, gist, handleSubmit, handleClose, handleUsernameChange, handleGistChange }) => {
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
            hintText="Github Username"
            value={username}
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
