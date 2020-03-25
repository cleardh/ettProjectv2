import axios from 'axios';
import {
  ADD_LEVEL,
  DELETE_LEVEL,
  GET_LEVEL,
  GET_LEVELS,
  CLEAR_LEVEL,
  LEVEL_ERROR
} from './types';
import { tokenConfig } from './auth';

export const addLevel = formData => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/level', formData, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_LEVEL,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: LEVEL_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteLevel = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this level for sure?')) {
    axios
      .delete(`http://localhost:5000/api/level/${id}`, tokenConfig(getState))
      .then(res => dispatch({ type: DELETE_LEVEL, payload: res.data }))
      .catch(err =>
        dispatch({
          type: LEVEL_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const getAllLevels = () => (dispatch, getState) => {
  axios
    .get('http://localhost:5000/api/level', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_LEVELS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: LEVEL_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getLevelByTitle = title => (dispatch, getState) => {
  dispatch({ type: CLEAR_LEVEL });

  axios
    .get(
      `http://localhost:5000/api/level/title/${title}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_LEVEL,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: LEVEL_ERROR,
        payload: { msg: err.message }
      })
    );
};
