import axios from 'axios';
import {
  DELETE_EMPLOYEE,
  GET_EMPLOYEE,
  GET_EMPLOYEES,
  CLEAR_EMPLOYEE,
  EMPLOYEE_ERROR,
  UPDATE_EMPLOYEE,
} from './types';
import { tokenConfig } from './auth';
import { setAlert } from './alert';

export const deleteEmployee = (id) => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this employee for sure?')) {
    axios
      .delete(`http://localhost:5000/api/employee/${id}`, tokenConfig(getState))
      .then((res) => dispatch({ type: DELETE_EMPLOYEE, payload: res.data }))
      .catch((err) =>
        dispatch({
          type: EMPLOYEE_ERROR,
          payload: { msg: err.message },
        })
      );
  }
};

export const getAllEmployees = () => (dispatch, getState) => {
  dispatch({ type: CLEAR_EMPLOYEE });

  axios
    .get('http://localhost:5000/api/employee', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_EMPLOYEES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: EMPLOYEE_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getCurrentEmployee = () => (dispatch, getState) => {
  dispatch({ type: CLEAR_EMPLOYEE });

  axios
    .get('http://localhost:5000/api/employee/me', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: EMPLOYEE_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getEmployeeByEmail = (email) => (dispatch, getState) => {
  dispatch({ type: CLEAR_EMPLOYEE });

  axios
    .get(
      `http://localhost:5000/api/employee/email/${email}`,
      tokenConfig(getState)
    )
    .then((res) => {
      dispatch({
        type: GET_EMPLOYEE,
        payload: res.data,
      });
      if (!res.data) {
        dispatch(setAlert('Employee not found', 'danger'));
        dispatch({ type: CLEAR_EMPLOYEE });
      }
    })
    .catch((err) => {
      dispatch({
        type: EMPLOYEE_ERROR,
        payload: { msg: err.message },
      });
    });
};

export const updateEmployee = (formData, id) => (dispatch, getState) => {
  dispatch({ type: CLEAR_EMPLOYEE });

  axios
    .put(
      `http://localhost:5000/api/employee/${id}`,
      formData,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: UPDATE_EMPLOYEE,
      })
    )
    .catch((err) =>
      dispatch({
        type: EMPLOYEE_ERROR,
        payload: { msg: err.message },
      })
    );
};
