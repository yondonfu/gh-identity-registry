import React from 'react';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';

import {} from './stylesheets/utils.scss';

const ProgressModal = ({ pending }) => (
  <Dialog
    title="Loading..."
    modal={true}
    open={pending}
  >
    <div className="progress-container">
      <CircularProgress size={80} thickness={5}/>
    </div>
  </Dialog>
);

export default ProgressModal;
