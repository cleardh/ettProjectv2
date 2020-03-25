import axios from 'axios';
import {
  ADD_ORGANIZATION,
  DELETE_ORGANIZATION,
  GET_ORGANIZATION,
  GET_ORGANIZATIONS,
  CLEAR_ORGANIZATION,
  ORGANIZATION_ERROR,
  GET_MEMBER_ORGANIZATIONS,
  ADD_MEMBER,
  DELETE_MEMBER
} from './types';
import { tokenConfig } from './auth';

export const addOrganization = formData => (dispatch, getState) => {
  axios
    .post(
      'http://localhost:5000/api/organization',
      formData,
      tokenConfig(getState)
    )
    .then(res => {
      console.log(res.data);

      dispatch({
        type: ADD_ORGANIZATION,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteOrganization = id => (dispatch, getState) => {
  if (window.confirm('Do you want to delete this organization for sure?')) {
    axios
      .delete(
        `http://localhost:5000/api/organization/${id}`,
        tokenConfig(getState)
      )
      .then(res =>
        dispatch({
          type: DELETE_ORGANIZATION,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: ORGANIZATION_ERROR,
          payload: { msg: err.message }
        })
      );
  }
};

export const addMemberToOrganization = (orgId, member) => (
  dispatch,
  getState
) => {
  axios
    .put(
      `http://localhost:5000/api/organization/${orgId}/add-member`,
      member,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: ADD_MEMBER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const deleteMemberFromOrganization = (orgId, email) => (
  dispatch,
  getState
) => {
  axios
    .put(
      `http://localhost:5000/api/organization/${orgId}/${email}`,
      null,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: DELETE_MEMBER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getAllOrganizations = () => (dispatch, getState) => {
  axios
    .get('http://localhost:5000/api/organization', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_ORGANIZATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getOrganizationsByMember = email => (dispatch, getState) => {
  axios
    .get(
      `http://localhost:5000/api/organization/member/${email}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_MEMBER_ORGANIZATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getOrganizationByTitle = title => (dispatch, getState) => {
  dispatch({ type: CLEAR_ORGANIZATION });

  axios
    .get(
      `http://localhost:5000/api/organization/title/${title}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_ORGANIZATION,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};

export const getOrganizationsByHead = headId => (dispatch, getState) => {
  axios
    .get(
      `http://localhost:5000/api/organization/head/${headId}`,
      tokenConfig(getState)
    )
    .then(res =>
      dispatch({
        type: GET_ORGANIZATIONS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ORGANIZATION_ERROR,
        payload: { msg: err.message }
      })
    );
};
