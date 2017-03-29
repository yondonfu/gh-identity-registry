import React from 'react';
import Dialog from 'material-ui/Dialog';

const WrongNetwork = ({ open }) => (
  <Dialog
    open={open}
    modal={true}
  >
    GHRegistry is deployed on the Ropsten Test Net. Please connect to the Ropsten Test Net to use GHRegistry.
  </Dialog>
);

export default WrongNetwork;
