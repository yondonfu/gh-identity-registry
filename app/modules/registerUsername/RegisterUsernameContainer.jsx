import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  verifyUsername,
  changeUsername,
  changeGist,
  openDialog,
  closeDialog
} from './actions/registerUsername';

import RegisterUsername from './RegisterUsername';

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
    this.props.dispatch(openDialog());
  }

  handleClose() {
    this.props.dispatch(closeDialog());
  }

  handleSubmit() {
    const { username, gist } = this.props;
    this.props.dispatch(verifyUsername(username, gist));
  }

  handleUsernameChange(e) {
    this.props.dispatch(changeUsername(e.target.value));
  }

  handleGistChange(e) {
    this.props.dispatch(changeGist(e.target.value));
  }

  render() {
    const { openDialog, pending, username, gist } = this.props;

    return (
      <div>
        <RaisedButton label="Register" onTouchTap={this.handleOpen}/>
        <RegisterUsername
          openDialog={openDialog}
          username={username}
          handleSubmit={this.handleSubmit}
          handleClose={this.handleClose}
          handleUsernameChange={this.handleUsernameChange}
          handleGistChange={this.handleGistChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { registerUsername } = state;

  const {
    openDialog,
    pending,
    username,
    gist
  } = registerUsername;

  return {
    openDialog,
    pending,
    username,
    gist
  };
};

export default connect(mapStateToProps)(RegisterUsernameContainer);
