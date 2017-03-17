import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import RegistryContainer from './modules/registry/RegistryContainer';
import RegisterUsernameContainer from './modules/registerUsername/RegisterUsernameContainer';

class App extends React.Component {
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <AppBar
            title="Github Identity Registry"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Router history={hashHistory}>
            <Route path="/" component={RegistryContainer}/>
            <Route path="/register" component={RegisterUsernameContainer}/>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }

}

export default App;
