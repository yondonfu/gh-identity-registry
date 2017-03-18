import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  transfer,
  changeNewOwner,
  openTransferDialog,
  closeTransferDialog
} from './actions/transferUsername';

import TransferUsername from './TransferUsername';
import NoUsername from './NoUsername';

class TransferUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewOwnerChange = this.handleNewOwnerChange.bind(this);
  }

  handleOpen() {
    this.props.dispatch(openTransferDialog());
  }

  handleClose() {
    this.props.dispatch(closeTransferDialog());
  }

  handleSubmit() {
    const { dispatch, account, newOwner } = this.props;
    dispatch(transfer(account, newOwner));
    dispatch(closeTransferDialog());
  }

  handleNewOwnerChange(e) {
    this.props.dispatch(changeNewOwner(e.target.value));
  }

  render() {
    const { openDialog, pending, newOwner, username, account } = this.props;

    let dialog = null;

    if (username.length == 0) {
      dialog = <NoUsername
                 openDialog={openDialog}
                 account={account}
                 handleClose={this.handleClose}
               />;
    } else {
      dialog = <TransferUsername
                 openDialog={openDialog}
                 account={account}
                 username={username}
                 newOwner={newOwner}
                 handleSubmit={this.handleSubmit}
                 handleClose={this.handleClose}
                 handleNewOwnerChange={this.handleNewOwnerChange}
               />;
    }

    return (
      <div>
        <RaisedButton label="Transfer" onTouchTap={this.handleOpen}/>
        {dialog}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { transferUsername } = state;

  const {
    openDialog,
    pending,
    newOwner,
  } = transferUsername;

  return {
    openDialog,
    pending,
    newOwner,
  };
};

export default connect(mapStateToProps)(TransferUsernameContainer);
