import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Panel from 'react-bootstrap/lib/Panel';

const NetworkDrawer = ({ open, networkName, account, balance, collateral }) => (
  <Drawer width={400} open={open}>
    <AppBar
      showMenuIconButton={false}
      titleStyle={{ fontSize: '1.5rem', textAlign: 'center' }}
      title="Ethereum Network Status"
    />
    <div className="app-drawer-container">
      <Panel header="Current Network">
        {networkName}
      </Panel>
      <Panel header="Current ETH Address">
        {account}
      </Panel>
      <Panel header="Current Wallet Balance">
        {balance}
      </Panel>
      <Panel header="Current Withdrawable Collateral">
        {collateral}
      </Panel>
    </div>
  </Drawer>
);

export default NetworkDrawer;
