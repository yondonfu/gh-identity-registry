import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  openNoUsername,
  closeNoUsername,
  openPendingTransfer,
  closePendingTransfer,
  openTransferUsername,
  closeTransferUsername,
  changeNewOwner,
  submitTransfer
} from './actions/transfer';

import TransferUsername from './TransferUsername';
import NoUsername from './NoUsername';
import PendingTransfer from './PendingTransfer';

import {} from './stylesheets/transfer.scss';

class Transfer extends React.Component {
  render() {
    const {
      account,
      username,
      transferUsername,
      pendingTransfer,
      noUsername,

      openNoUsername,
      closeNoUsername,
      openPendingTransfer,
      closePendingTransfer,
      openTransferUsername,
      closeTransferUsername,
      submitTransfer,
      changeNewOwner
    } = this.props;

    let transferButton;

    if (!username) {
      transferButton = <RaisedButton label="Transfer" onTouchTap={openNoUsername}/>;
    } else if (pendingTransfer.txId) {
      transferButton = <RaisedButton label="Transfer" onTouchTap={openPendingTransfer}/>;
    } else {
      transferButton = <RaisedButton label="Transfer" onTouchTap={openTransferUsername}/>;
    }

    return (
      <div className="transfer-container">
        <NoUsername
          {...noUsername}
          handleClose={closeNoUsername}
        />
        <PendingTransfer
          {...pendingTransfer}
          handleClose={closePendingTransfer}
        />
        <TransferUsername
          {...transferUsername}
          account={account}
          username={username}
          handleClose={closeTransferUsername}
          handleNewOwnerChange={changeNewOwner}
          handleSubmit={submitTransfer}
        />
        {transferButton}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { transfer } = state;

  const {
    transferUsername,
    pendingTransfer,
    noUsername
  } = transfer;

  return {
    transferUsername,
    pendingTransfer,
    noUsername
  };
};

const mapDispatchToProps = dispatch => ({
  openTransferUsername: () => {
    dispatch(openTransferUsername());
  },
  closeTransferUsername: () => {
    dispatch(closeTransferUsername());
  },
  submitTransfer: () => {
    dispatch(submitTransfer())
  },
  openPendingTransfer: () => {
    dispatch(openPendingTransfer());
  },
  closePendingTransfer: () => {
    dispatch(closePendingTransfer());
  },
  openNoUsername: () => {
    dispatch(openNoUsername());
  },
  closeNoUsername: () => {
    dispatch(closeNoUsername());
  },
  changeNewOwner: e => {
    dispatch(changeNewOwner(e.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
