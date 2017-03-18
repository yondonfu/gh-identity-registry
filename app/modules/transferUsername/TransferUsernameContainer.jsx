import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  transfer,
  changeNewOwner,
  openDialog,
  closeDialog
} from './actions/transferUsername';

import TransferUsername from './TransferUsername';

class TransferUsernameContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewOwnerChange = this.handleNewOwnerChange.bind(this);
  }

  handleOpen() {
    this.props.dispatch(openDialog());
  }

  handleClose() {
    this.props.dispatch(closeDialog());
  }

  handleSubmit() {
    const { newOwner } = this.props;
    this.props.dispatch(transfer(newOwner));
  }

  handleNewOwnerChange(e) {
    this.props.dispatch(changeNewOwner(e.target.value));
  }

  render() {
    const { openDialog, pending, newOwner } = this.props;

    return (
      <div>
        <RaisedButton label="Transfer" onTouchTap={this.handleOpen}/>
        <TransferUsername
          openDialog={openDialog}
          newOwner={newOwner}
          handleSubmit={this.handleSubmit}
          handleClose={this.handleClose}
          handleNewOwnerChange={this.handleNewOwnerChange}
        />
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
