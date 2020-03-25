import axios from 'axios';
import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORIES,
  CLEAR_CATEGORY,
  CATEGORY_ERROR
} from './types';
import { tokenConfig } from './auth';

export const addCategory = formData => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/category', formData, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ADD_CATEGORY,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: CATEGORY_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteCategory = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this category for sure?')) {
    axios
      .delete(`http://localhost:5000/api/category/${id}`, tokenConfig(getState))
      .then(res => dispatch({ type: DELETE_CATEGORY, payload: res.data }))
      .catch(err =>
        dispatch({
          type: CATEGORY_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const getAllCategories = () => (dispatch, getState) => {
  axios
    .get('http://localhost:5000/api/category', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: CATEGORY_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getCategoryByTitle = title => (dispatch, getState) => {
  dispatch({ type: CLEAR_CATEGORY });
  console.log(title);

  axios
    .get(
      `http://localhost:5000/api/category/title/${title}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_CATEGORY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: CATEGORY_ERROR,
        payload: { msg: err.message }
      })
    );
};
