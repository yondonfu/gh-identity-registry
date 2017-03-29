import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducers';

import App from './modules/app/App';

import { loadWeb3 } from './services/web3';
import { loadGHRegistry } from './services/ghRegistry';

window.addEventListener('load', () => {
  const web3 = loadWeb3();
  const GHRegistry = loadGHRegistry(web3);

  const injectMiddleware = deps => () => next => action =>
    next(typeof action === 'function'
       ? action(deps)
       : action
    );

  const middleware = [
    injectMiddleware({
      web3,
      GHRegistry
    }),
    thunk
  ];

  const store = createStore(
    reducer,
    applyMiddleware(...middleware)
  );

  render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('app')
  );
});
