import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const TransferUsername = ({ openDialog, account, username, newOwner, handleSubmit, handleClose, handleNewOwnerChange }) => {
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
      title="Transfer Username"
      actions={actions}
      modal={false}
      open={openDialog}
      onRequestClose={handleClose}
    >
      <form>
        <div>
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
              disabled={true}
              fullWidth={true}
              defaultValue={username}
              floatingLabelText="Username"
            />
          </div>
          <div>
            <TextField
              fullWidth={true}
              hintText="New Owner"
              value={newOwner}
              onChange={handleNewOwnerChange}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default TransferUsername;
