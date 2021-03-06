import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {} from './stylesheets/register.scss';

const VerifyUsername = ({
  current,
  account,
  targetUsername,
  gist,
  handleSubmitVerifyUsername,
  handleCloseVerifyUsername,
  handleUsernameChange,
  handleGistChange,
}) => {
  const actions = [
    <RaisedButton
      className="register-cancel-button"
      label="Cancel"
      onTouchTap={handleCloseVerifyUsername}
    />,
    <RaisedButton
      label="Verify"
      onTouchTap={handleSubmitVerifyUsername}
    />
  ];

  return (
    <div>
      <Dialog
        title="Verify Username"
        actions={actions}
        modal={false}
        open={current}
        autoScrollBodyContent={true}
      >
        <form action="">
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
          <div>
            Verification requires a 1 ETH deposit. Part of the deposit is used to pay for the Oraclize fee. You can withdraw
            the remaining amount of the deposit after verification in the Settings section.
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default VerifyUsername;
