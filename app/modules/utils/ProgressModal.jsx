import React from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

const ProgressModal = ({ pending }) => (
  <Dialog
    title="Loading.."
    modal={true}
    open={pending}
  >
    <CircularProgress size={80} thickness={5}/>
  </Dialog>
);

export default ProgressModal;
