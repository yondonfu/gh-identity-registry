import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  verifyUsername,
  changeUsername,
  changeGist,
  openRegisterDialog,
  closeRegisterDialog,
  resetRegisterUsernameError
} from './actions/registerUsername';

import RegisterUsername from './RegisterUsername';
import RegisteredUsername from './RegisteredUsername';
import ProgressModal from '../utils/ProgressModal';
import FailureModal from '../utils/FailureModal';

import {} from './stylesheets/registerUsername.scss';

class RegisterUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleGistChange = this.handleGistChange.bind(this);
    this.handleFailureClose = this.handleFailureClose.bind(this);
  }

  handleOpen() {
    this.props.dispatch(openRegisterDialog());
  }

  handleClose() {
    this.props.dispatch(closeRegisterDialog());
  }

  handleFailureClose() {
    this.props.dispatch(resetRegisterUsernameError());
  }

  handleSubmit() {
    const { dispatch, targetUsername, gist, account } = this.props;

    const prefix = 'https://gist.githubusercontent.com/' + targetUsername;

    if (!gist.startsWith(prefix)) {
      console.log('Invalid gist');
    } else {
      dispatch(verifyUsername(account, targetUsername, gist.slice(prefix.length)));
      dispatch(closeRegisterDialog());
    }
  }

  handleUsernameChange(e) {
    this.props.dispatch(changeUsername(e.target.value));
  }

  handleGistChange(e) {
    this.props.dispatch(changeGist(e.target.value));
  }

  render() {
    const { openDialog, pending, error, targetUsername, gist, account, username } = this.props;

    let dialog = null;

    if (username.length > 0) {
      dialog = <RegisteredUsername
                 openDialog={openDialog}
                 account={account}
                 username={username}
                 handleClose={this.handleClose}
               />;
    } else {
      dialog = <RegisterUsername
                 openDialog={openDialog}
                 account={account}
                 gist={gist}
                 targetUsername={targetUsername}
                 handleSubmit={this.handleSubmit}
                 handleClose={this.handleClose}
                 handleUsernameChange={this.handleUsernameChange}
                 handleGistChange={this.handleGistChange}
               />;
    }

    return (
      <div className="register-container">
        <ProgressModal pending={pending}/>
        <FailureModal failed={error.length > 0} error={error} handleFailureClose={this.handleFailureClose}/>
        <RaisedButton label="Register" onTouchTap={this.handleOpen}/>
        {dialog}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { registerUsername } = state;

  const {
    openDialog,
    pending,
    targetUsername,
    gist,
    error
  } = registerUsername;

  return {
    openDialog,
    pending,
    targetUsername,
    gist,
    error
  };
};

export default connect(mapStateToProps)(RegisterUsernameContainer);
