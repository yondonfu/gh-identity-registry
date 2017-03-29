import React from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import WrongNetwork from './WrongNetwork';
import Header from './Header';
import Home from './Home';
import About from './About';

import { fetchInfo, toggleDrawer, withdraw } from './actions/app';

class App extends React.Component {
  componentDidMount() {
    this.props.loadInfo();
  }

  render() {
    const { account, username, networkName } = this.props;

    return (
      <div>
        <MuiThemeProvider>
          <Router>
            <div>
              <Header
                {...this.props}
              />
              <Route
                exact path="/"
                component={() => <Home account={account} username={username}/>}
              />
              <Route path="/about" component={About}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

injectTapEventPlugin();

const mapStateToProps = state => {
  const { app } = state;

  const {
    pending,
    networkName,
    account,
    balance,
    contractAddress,
    username,
    collateral,
    withdrawPending,
    openDrawer
  } = app;

  return {
    pending,
    networkName,
    account,
    balance,
    contractAddress,
    username,
    collateral,
    withdrawPending,
    openDrawer
  }
};

const mapDispatchToProps = dispatch => ({
  loadInfo: () => {
    dispatch(fetchInfo())
  },
  handleDrawer: () => {
    dispatch(toggleDrawer())
  },
  handleWithdraw: () => {
    dispatch(withdraw())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
