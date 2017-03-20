import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/Dialog';

const FailureModal = ({ failed, error, handleFailureClose }) => {
  return (
    <Dialog
      title="Operation Failed"
      open={failed}
      onRequestClose={handleFailureClose}
    >
      {error}
    </Dialog>
  );
};

export default FailureModal;
