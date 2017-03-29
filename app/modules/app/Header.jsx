import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Panel from 'react-bootstrap/lib/Panel';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import {} from './stylesheets/header.scss';

const Header = ({ openDrawer, networkName, account, balance, contractAddress, username, collateral, withdrawPending, handleWithdraw, handleDrawer }) => {
  const rightButtons = (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon/></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Home" containerElement={<Link to="/"/>}/>
      <MenuItem primaryText="About" containerElement={<Link to="/about"/>}/>
      <MenuItem primaryText="Settings" onTouchTap={handleDrawer}/>
    </IconMenu>
  );

  let collateralInfo;

  if (collateral > 0 && !withdrawPending) {
    collateralInfo = <RaisedButton className="header-withdraw-button" label="Withdraw" onTouchTap={handleWithdraw}/>;
  } else if (collateral > 0 && withdrawPending) {
    collateralInfo = <p>Pending Withdrawal...</p>;
  } else {
    collateralInfo = <span></span>;
  }

  return (
    <div>
      <AppBar
        showMenuIconButton={false}
        title="GHRegistry"
        iconElementRight={rightButtons}
      />

      <Drawer width={400} open={openDrawer}>
        <AppBar
          showMenuIconButton={false}
          titleStyle={{ fontSize: '1.5rem', textAlign: 'center' }}
          title="Info"
        />
        <div className="header-drawer">
          <Panel header="Current Network">
            {networkName}
          </Panel>
          <Panel header="Contract Address">
            {contractAddress}
          </Panel>
          <Panel header="ETH Address">
            {account}
          </Panel>
          <Panel header="Wallet Balance">
            {balance}
          </Panel>
          <Panel header="Github Username">
            {username.length == 0 &&
             <span>No Registered Username</span>
            }
          </Panel>
          <Panel header="Withdrawable Collateral">
            {collateral}
          </Panel>
          {collateralInfo}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
