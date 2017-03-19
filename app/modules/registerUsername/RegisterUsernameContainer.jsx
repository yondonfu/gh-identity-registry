import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  verifyUsername,
  changeUsername,
  changeGist,
  openRegisterDialog,
  closeRegisterDialog
} from './actions/registerUsername';

import RegisterUsername from './RegisterUsername';
import RegisteredUsername from './RegisteredUsername';

import {} from './stylesheets/registerUsername.scss';

class RegisterUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleGistChange = this.handleGistChange.bind(this);
  }

  handleOpen() {
    this.props.dispatch(openRegisterDialog());
  }

  handleClose() {
    this.props.dispatch(closeRegisterDialog());
  }

  handleSubmit() {
    const { dispatch, targetUsername, gist, account } = this.props;
    dispatch(verifyUsername(account, targetUsername, gist));
    dispatch(closeRegisterDialog());
  }

  handleUsernameChange(e) {
    this.props.dispatch(changeUsername(e.target.value));
  }

  handleGistChange(e) {
    this.props.dispatch(changeGist(e.target.value));
  }

  render() {
    const { openDialog, pending, targetUsername, gist, account, username } = this.props;

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
                 targetUsername={targetUsername}
                 handleSubmit={this.handleSubmit}
                 handleClose={this.handleClose}
                 handleUsernameChange={this.handleUsernameChange}
                 handleGistChange={this.handleGistChange}
               />;
    }

    return (
      <div className="register-container">
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
    gist
  } = registerUsername;

  return {
    openDialog,
    pending,
    targetUsername,
    gist
  };
};

export default connect(mapStateToProps)(RegisterUsernameContainer);
