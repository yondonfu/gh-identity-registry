import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const TransferUsername = ({
  open,
  account,
  username,
  newOwner,
  handleNewOwnerChange,
  handleClose,
  handleSubmit
}) => {
  const actions = [
    <RaisedButton
      className="transfer-cancel-button"
      label="Cancel"
      onTouchTap={handleClose}
    />,
    <RaisedButton
      label="Submit"
      onTouchTap={handleSubmit}
    />
  ];

  return (
    <div>
      <Dialog
        title="Transfer Username"
        actions={actions}
        modal={false}
        open={open}
        autoScrollBodyContent={true}
      >
        <div>
          <TextField
            disabled={true}
            fullWidth={true}
            defaultValue={account}
            floatingLabelText="ETH Address"
          />
        </div>
        <div>
          <TextField
            disabled={true}
            fullWidth={true}
            defaultValue={username}
            floatingLabelText="Github Username"
          />
        </div>
        <div>
          <TextField
            hintText="New Owner"
            value={newOwner}
            onChange={handleNewOwnerChange}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default TransferUsername;
