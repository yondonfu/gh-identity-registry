import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Well from 'react-bootstrap/lib/Well';

import {} from './stylesheets/register.scss';

const CreateGist = ({
  current,
  account,
  handleCloseCreateGist,
  handleNextStep
}) => {
  const actions = [
    <RaisedButton
      className="register-cancel-button"
      label="Cancel"
      onTouchTap={handleCloseCreateGist}
    />,
    <RaisedButton
      label="Next"
      onTouchTap={handleNextStep}
    />
  ];

  return (
    <div>
      <Dialog
        title="Create Gist"
        actions={actions}
        modal={false}
        open={current}
        autoScrollBodyContent={true}
      >
        <div className="register-create-gist-content">
          <p>
            In order to link your Github username with your Ethereum address, you must post a public Gist file on Github with a single line containing
            your Ethereum address.
          </p>

          <Well>{account}</Well>

          <p>
            After creating the Gist file, make sure to save the raw content URL. You can access the raw content version of the Gist file and its associated
            raw content URL by clicking the Raw button in the Github Gist user interface.
          </p>

          <a target="_blank" href="https://gist.github.com/">Create a public Gist file on Github</a>
        </div>
      </Dialog>
    </div>
  );
}

export default CreateGist;
