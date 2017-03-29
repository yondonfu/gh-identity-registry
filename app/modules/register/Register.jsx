import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import CreateGist from './CreateGist';
import VerifyUsername from './VerifyUsername';
import PendingVerification from './PendingVerification';
import RegisteredUsername from './RegisteredUsername';

import {} from './stylesheets/register.scss';

import {
  openCreateGist,
  closeCreateGist,
  openPendingVerification,
  closePendingVerification,
  openVerifyUsername,
  closeVerifyUsername,
  submitVerifyUsername,
  openRegisteredUsername,
  closeRegisteredUsername,
  changeTargetUsername,
  changeGist
} from './actions/register';

class RegisterWorkflow extends React.Component {
  render() {
    const {
      account,
      username,
      createGist,
      verifyUsername,
      pendingVerification,
      registeredUsername,

      handleNextStep,
      handleOpenCreateGist,
      handleCloseCreateGist,
      handleOpenPendingVerification,
      handleClosePendingVerification,
      handleOpenRegisteredUsername,
      handleCloseRegisteredUsername,
      handleSubmitVerifyUsername,
      handleCloseVerifyUsername,
      handleUsernameChange,
      handleGistChange
    } = this.props;

    let registerButton;

    if (username) {
      registerButton = <RaisedButton label="Register" onTouchTap={handleOpenRegisteredUsername}/>;
    } else if (pendingVerification.txId) {
      registerButton = <RaisedButton label="Register" onTouchTap={handleOpenPendingVerification}/>;
    } else {
      registerButton = <RaisedButton label="Register" onTouchTap={handleOpenCreateGist}/>;
    }

    return (
      <div className="register-container">
        <RegisteredUsername
          {...registeredUsername}
          account={account}
          username={username}
          handleCloseRegisteredUsername={handleCloseRegisteredUsername}
        />
        <PendingVerification
          {...pendingVerification}
          handleClosePendingVerification={handleClosePendingVerification}
        />
        <CreateGist
          {...createGist}
          account={account}
          handleNextStep={handleNextStep}
          handleCloseCreateGist={handleCloseCreateGist}
        />
        <VerifyUsername
          {...verifyUsername}
          account={account}
          handleSubmitVerifyUsername={handleSubmitVerifyUsername}
          handleCloseVerifyUsername={handleCloseVerifyUsername}
          handleUsernameChange={handleUsernameChange}
          handleGistChange={handleGistChange}
        />
        {registerButton}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { register } = state;

  const {
    createGist,
    verifyUsername,
    pendingVerification,
    registeredUsername
  } = register;

  return {
    createGist,
    verifyUsername,
    pendingVerification,
    registeredUsername
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleOpenCreateGist: () => {
    dispatch(openCreateGist());
  },
  handleCloseCreateGist: () => {
    dispatch(closeCreateGist());
  },
  handleOpenPendingVerification: () => {
    dispatch(openPendingVerification());
  },
  handleClosePendingVerification: () => {
    dispatch(closePendingVerification());
  },
  handleNextStep: () => {
    dispatch(closeCreateGist());
    dispatch(openVerifyUsername());
  },
  handleCloseVerifyUsername: () => {
    dispatch(closeVerifyUsername());
  },
  handleSubmitVerifyUsername: () => {
    dispatch(submitVerifyUsername());
    dispatch(closeVerifyUsername());
    dispatch(openPendingVerification());
  },
  handleOpenRegisteredUsername: () => {
    dispatch(openRegisteredUsername());
  },
  handleCloseRegisteredUsername: () => {
    dispatch(closeRegisteredUsername());
  },
  handleUsernameChange: e => {
    dispatch(changeTargetUsername(e.target.value));
  },
  handleGistChange: e => {
    dispatch(changeGist(e.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWorkflow);
