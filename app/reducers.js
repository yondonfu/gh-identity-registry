import { combineReducers } from 'redux';
import app from './modules/app/reducers/app';
import withdraw from './modules/withdraw/reducers/withdraw';
import registry from './modules/registry/reducers/registry';
import register from './modules/register/reducers/register';
import transfer from './modules/transfer/reducers/transfer';

const rootReducer = combineReducers({
  app,
  withdraw,
  registry,
  register,
  transfer
});

export default rootReducer;
