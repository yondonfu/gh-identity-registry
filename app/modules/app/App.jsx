import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import { fetchCurrentInfo, toggleDrawer, withdraw } from './actions/app';

import SettingsDrawer from './SettingsDrawer';
import ProgressModal from '../utils/ProgressModal';
import RegistryContainer from '../registry/RegistryContainer';
import RegisterUsernameContainer from '../registerUsername/RegisterUsernameContainer';
import TransferUsernameContainer from '../transferUsername/TransferUsernameContainer';

import {} from './stylesheets/app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleDrawer = this.handleDrawer.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchCurrentInfo());
  }

  handleDrawer() {
    this.props.dispatch(toggleDrawer());
  }

  handleWithdraw() {
    const { dispatch, account } = this.props;
    dispatch(withdraw(account));
  }

  render() {
    const { pending, account, balance, collateral, username, openDrawer, networkName, withdrawPending } = this.props;

    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            showMenuIconButton={false}
            title="Github Identity Registry"
            iconElementRight={<FlatButton label="Settings" onTouchTap={this.handleDrawer}/>}
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <div>
            <ProgressModal pending={pending}/>
            <SettingsDrawer
              open={openDrawer}
              networkName={networkName}
              account={account}
              balance={balance}
              collateral={collateral}
              handleWithdraw={this.handleWithdraw}
              withdrawPending={withdrawPending}
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
    pending,
    account,
    balance,
    collateral,
    username,
    networkName,
    openDrawer,
    withdrawPending
  } = app;

  return {
    pending,
    account,
    balance,
    collateral,
    username,
    openDrawer,
    networkName,
    withdrawPending
  };
}

injectTapEventPlugin();

export default connect(mapStateToProps)(App);
