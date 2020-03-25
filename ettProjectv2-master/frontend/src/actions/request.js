import axios from 'axios';
import {
  ADD_REQUEST,
  DELETE_REQUEST,
  GET_REQUEST,
  GET_REQUESTS,
  CLEAR_REQUEST,
  REQUEST_ERROR
} from './types';
import { tokenConfig } from './auth';

export const addRequest = formData => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/request', formData, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_REQUEST,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteRequest = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this request for sure?')) {
    axios
      .delete(`http://localhost:5000/api/request/${id}`, tokenConfig(getState))
      .then(res => dispatch({ type: DELETE_REQUEST, payload: res.data }))
      .catch(err =>
        dispatch({
          type: REQUEST_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const getRequestsByEmployee = employeeId => (dispatch, getState) => {
  dispatch({ type: CLEAR_REQUEST });

  axios
    .get(
      `http://localhost:5000/api/request/${employeeId}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getConfirmedRequestsByEmployee = employeeId => (
  dispatch,
  getState
) => {
  dispatch({ type: CLEAR_REQUEST });

  axios
    .get(
      `http://localhost:5000/api/request/confirmed/${employeeId}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getConfirmedRequestsByEmployeeCategory = (
  employeeId,
  categoryId
) => (dispatch, getState) => {
  dispatch({ type: CLEAR_REQUEST });

  axios
    .get(
      `http://localhost:5000/api/request/confirmed/${employeeId}/${categoryId}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const confirmRequest = id => (dispatch, getState) => {
  dispatch({ type: CLEAR_REQUEST });

  axios
    .put(`http://localhost:5000/api/request/${id}`, null, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_REQUEST,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message }
      })
    );
};
