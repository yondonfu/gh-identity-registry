import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import { fetchAccountAndUsername, toggleDrawer, fetchNetwork } from './actions/app';

import NetworkDrawer from './NetworkDrawer';
import RegistryContainer from '../registry/RegistryContainer';
import RegisterUsernameContainer from '../registerUsername/RegisterUsernameContainer';
import TransferUsernameContainer from '../transferUsername/TransferUsernameContainer';

import {} from './stylesheets/app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleDrawer = this.handleDrawer.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(fetchAccountAndUsername());
    this.props.dispatch(fetchNetwork());
  }

  handleDrawer() {
    this.props.dispatch(toggleDrawer());
  }

  render() {
    const { account, balance, collateral, username, openDrawer, networkName } = this.props;

    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            showMenuIconButton={false}
            title="Github Identity Registry"
            iconElementRight={<FlatButton label="Network Status" onTouchTap={this.handleDrawer}/>}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <div>
            <NetworkDrawer
              open={openDrawer}
              networkName={networkName}
              account={account}
              balance={balance}
              collateral={collateral}
            />
            <Jumbotron className="app-jumbotron">
              <h1>Github Identity Registry</h1>
              <p>
                Register your Github username with an Ethereum address
              </p>
              <div className="app-button-container">
                <RegisterUsernameContainer account={account} username={username}/>
                <TransferUsernameContainer account={account} username={username}/>
              </div>
            </Jumbotron>
            <RegistryContainer/>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const { app } = state;

  const {
    currentAccount,
    currentUsername,
    drawer
  } = app;

  const {
    accountPending,
    account,
    balance,
    collateral,
  } = currentAccount;

  const {
    usernamePending,
    username
  } = currentUsername;

  const {
    openDrawer,
    networkName
  } = drawer;

  return {
    accountPending,
    usernamePending,
    account,
    balance,
    collateral,
    username,
    openDrawer,
    networkName
  };
}

injectTapEventPlugin();

export default connect(mapStateToProps)(App);
