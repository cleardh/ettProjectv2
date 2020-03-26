import { combineReducers } from 'redux';
import auth from './auth';
import category from './category';
import employee from './employee';
import job from './job';
import level from './level';
import organization from './organization';
import request from './request';
import role from './role';

export default combineReducers({
  auth,
  category,
  employee,
  job,
  level,
  organization,
  request,
  role
});
