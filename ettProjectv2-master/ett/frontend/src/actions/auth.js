import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

// Set x-auth-token in headers
export const tokenConfig = (getState) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': `${getState().auth.token}`,
    },
  };
};

// Reload user
export const loadUser = () => (dispatch) => {
  if (localStorage.token) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${localStorage.token}`,
      },
    };
    axios
      .get('http://localhost:5000/api/auth', config)
      .then((res) =>
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        })
      )
      .catch((err) => {
        dispatch({ type: AUTH_ERROR });
        console.error(err.message);
      });
  }
};

// Load user
export const authenticate = () => (dispatch, getState) => {
  // Get token & store it in reducer
  axios
    .get('http://localhost:5000/api/auth/google/success')
    .then((res) => {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      return res;
    })
    .then((res) => {
      // Load user & store it in reducer
      axios
        .get('http://localhost:5000/api/auth', tokenConfig(getState))
        .then((res) =>
          dispatch({
            type: USER_LOADED,
            payload: res.data,
          })
        )
        .catch((err) => {
          dispatch({ type: AUTH_ERROR });
          console.error(err.message);
        });
    })
    .catch((err) => {
      // const errors = err.response.data.errors;
      // if (errors) {
      // errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      console.error(err);
      // }
      dispatch({ type: LOGIN_FAIL });
    });
};

// Register user
export const register = (formData, id, history) => (dispatch, getState) => {
  axios
    .put(
      `http://localhost:5000/api/employee/${id}`,
      formData,
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      history.push('/dashboard/individual');
    })
    .catch((err) =>
      dispatch({
        type: REGISTER_FAIL,
        payload: { msg: err.message },
      })
    );
};

// Sign in user
export const login = () => (dispatch) => {
  window.open('http://localhost:5000/api/auth/google', '_self');
};

// Sign out user
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
