import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import { fetchAccountAndUsername } from './actions/app';

import RegistryContainer from '../registry/RegistryContainer';
import RegisterUsernameContainer from '../registerUsername/RegisterUsernameContainer';
import TransferUsernameContainer from '../transferUsername/TransferUsernameContainer';

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchAccountAndUsername());
  }

  render() {
    const { account, username } = this.props;

    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            title="Github Identity Registry"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <div>
            <RegisterUsernameContainer account={account} username={username}/>
            <TransferUsernameContainer account={account} username={username}/>
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
    currentUsername
  } = app;

  const {
    accountPending,
    account
  } = currentAccount;

  const {
    usernamePending,
    username
  } = currentUsername;

  return {
    accountPending,
    usernamePending,
    account,
    username
  };
}

injectTapEventPlugin();

export default connect(mapStateToProps)(App);
