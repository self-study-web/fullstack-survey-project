import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import AuthReducer from './authReducer';
import surveysReducer from './surveysReducer';

export default combineReducers({
  auth: AuthReducer,
  form: reduxForm /* The keyname of form(can be changed if needed) and reducer import is important */,
  surveys: surveysReducer
});
