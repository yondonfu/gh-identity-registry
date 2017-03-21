import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Panel from 'react-bootstrap/lib/Panel';

const SettingsDrawer = ({ open, networkName, account, balance, collateral, handleWithdraw, withdrawPending }) => (
  <Drawer width={400} open={open}>
    <AppBar
      showMenuIconButton={false}
      titleStyle={{ fontSize: '1.5rem', textAlign: 'center' }}
      title="Settings"
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
      {withdrawPending &&
       <p>Withdrawal In-Progress</p>
      }
      {collateral > 0 && !withdrawPending &&
       <RaisedButton label="Withdraw Collateral" onTouchTap={handleWithdraw}/>
      }
    </div>
  </Drawer>
);

export default SettingsDrawer;
