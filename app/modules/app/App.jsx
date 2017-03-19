import React from 'react';
import { connect } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import { fetchAccountAndUsername } from './actions/app';

import RegistryContainer from '../registry/RegistryContainer';
import RegisterUsernameContainer from '../registerUsername/RegisterUsernameContainer';
import TransferUsernameContainer from '../transferUsername/TransferUsernameContainer';

import {} from './stylesheets/app.scss';

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
