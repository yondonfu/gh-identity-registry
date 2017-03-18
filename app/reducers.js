import { combineReducers } from 'redux';
import app from './modules/app/reducers/app';
import registry from './modules/registry/reducers/registry';
import registerUsername from './modules/registerUsername/reducers/registerUsername';
import transferUsername from './modules/transferUsername/reducers/transferUsername';

const rootReducer = combineReducers({
  app,
  registry,
  registerUsername,
  transferUsername
});

export default rootReducer;
