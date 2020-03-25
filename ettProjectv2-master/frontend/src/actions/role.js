import axios from 'axios';
import {
  ADD_ROLE,
  DELETE_ROLE,
  GET_ROLE,
  GET_ROLES,
  CLEAR_ROLE,
  ROLE_ERROR
} from './types';
import { tokenConfig } from './auth';

export const addRole = formData => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/role', formData, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_ROLE,
        payload: res.data
      });
      console.log(`Role ${formData.title} added`);
    })
    .catch(err =>
      dispatch({
        type: ROLE_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteRole = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this role for sure?')) {
    axios
      .delete(`http://localhost:5000/api/role/${id}`, tokenConfig(getState))
      .then(res => dispatch({ type: DELETE_ROLE, payload: res.data }))
      .catch(err =>
        dispatch({
          type: ROLE_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const getAllRoles = () => (dispatch, getState) => {
  axios
    .get('http://localhost:5000/api/role', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_ROLES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ROLE_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getRoleByTitle = title => (dispatch, getState) => {
  dispatch({ type: CLEAR_ROLE });

  axios
    .get(`http://localhost:5000/api/role/title/${title}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_ROLE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ROLE_ERROR,
        payload: { msg: err.message }
      })
    );
};
