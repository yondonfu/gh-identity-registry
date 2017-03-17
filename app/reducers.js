import { combineReducers } from 'redux';
import registry from './modules/registry/reducers/registry';
import registerUsername from './modules/registerUsername/reducers/registerUsername';
import transferUsername from './modules/transferUsername/reducers/transferUsername';

const rootReducer = combineReducers({
  registry,
  registerUsername,
  transferUsername
});

export default rootReducer;
