import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import RegistryContainer from './modules/registry/RegistryContainer';
import RegisterUsernameContainer from './modules/registerUsername/RegisterUsernameContainer';
import TransferUsernameContainer from './modules/transferUsername/TransferUsernameContainer';

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
          <div>
            <div>
              <RegisterUsernameContainer/>
            </div>
            <div>
              <TransferUsernameContainer/>
            </div>
            <RegistryContainer/>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }

}

injectTapEventPlugin();

export default App;
