import axios from 'axios';
import {
  ADD_JOB,
  DELETE_JOB,
  GET_JOB,
  GET_JOBS,
  CLEAR_JOB,
  JOB_ERROR
} from './types';
import { tokenConfig } from './auth';

export const addJob = formData => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/job', formData, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_JOB,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: JOB_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteJob = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this job for sure?')) {
    axios
      .delete(`http://localhost:5000/api/job/${id}`, tokenConfig(getState))
      .then(res => dispatch({ type: DELETE_JOB, payload: res.data }))
      .catch(err =>
        dispatch({
          type: JOB_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const getAllJobs = () => (dispatch, getState) => {
  axios
    .get('http://localhost:5000/api/job', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_JOBS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: JOB_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getJobById = id => (dispatch, getState) => {
  dispatch({ type: CLEAR_JOB });

  axios
    .get(`http://localhost:5000/api/job/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_JOB,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: JOB_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getJobByTitle = title => (dispatch, getState) => {
  dispatch({ type: CLEAR_JOB });

  axios
    .get(`http://localhost:5000/api/job/title/${title}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_JOB,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: JOB_ERROR,
        payload: { msg: err.message }
      })
    );
};
