import axios from 'axios';
import {
  ADD_REQUEST,
  DELETE_REQUEST,
  GET_REQUEST,
  GET_REQUESTS,
  CLEAR_REQUEST,
  REQUEST_ERROR,
} from './types';
import moment from 'moment-timezone';
import { tokenConfig } from './auth';
import { setAlert } from './alert';

export const addRequest = (formData, calendarId) => (dispatch, getState) => {
  axios
    .post('http://localhost:5000/api/request', formData, tokenConfig(getState))
    .then((res) =>
      axios
        .post(
          'http://localhost:5000/api/calendar',
          {
            calendarId: calendarId,
            requestId: res.data._id,
          },
          tokenConfig(getState)
        )
        .then((res) => {
          if (res.data.error) {
            dispatch(
              setAlert(
                'Google Calendar Error: Check your Calendar ID',
                'danger'
              )
            );
          } else {
            dispatch(setAlert('Request placed successfully', 'success'));
            dispatch({
              type: ADD_REQUEST,
              payload: res.data,
            });
          }
        })
        .catch((err) => {
          dispatch({
            type: REQUEST_ERROR,
            payload: { msg: err.message },
          });
        })
    )
    .catch((err) => {
      dispatch(setAlert('Invalid request', 'danger'));
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      });
    });
};

export const deleteRequest = (request) => (dispatch, getState) => {
  if (
    moment(request.dateS).tz('Ameraca/Toronto').format('YYYY-MM-DD') <
    moment().tz('Ameraca/Toronto').format('YYYY-MM-DD')
  ) {
    dispatch(setAlert('Past request', 'danger'));
  } else {
    axios
      .delete(
        `http://localhost:5000/api/request/${request._id}`,
        tokenConfig(getState)
      )
      .then((res) => {
        axios
          .delete(
            `http://localhost:5000/api/calendar/${request.user.calendarId}/${res.data.googleEventId}`,
            tokenConfig(getState)
          )
          .then((res) => {
            res.data.error
              ? dispatch(
                  setAlert('Event not found in Google Calendar', 'warning')
                )
              : dispatch(setAlert('Request removed', 'success'));
            dispatch({ type: DELETE_REQUEST, payload: request });
          })
          .catch((err) => {
            dispatch({
              type: REQUEST_ERROR,
              payload: { msg: err.message },
            });
          });
      })
      .catch((err) =>
        dispatch({
          type: REQUEST_ERROR,
          payload: { msg: err.message },
        })
      );
  }
};

export const generateReport = (dateRange) => (dispatch, getState) => {
  axios
    .post(
      'http://localhost:5000/api/request/report',
      dateRange,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch(
        setAlert(`${res.data.file} has been generated successfully`, 'success')
      )
    )
    .catch((err) => {
      console.log(err.response);
      err.response.data.msg === 'Request not found' &&
        dispatch(setAlert('No record found', 'danger'));
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      });
    });
};

export const getAllRequests = () => (dispatch, getState) => {
  axios
    .get(`http://localhost:5000/api/request`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getRequestsByOrg = (orgId) => (dispatch, getState) => {
  axios
    .get(
      `http://localhost:5000/api/request/org/${orgId}`,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getRequestsByEmployee = (employeeId) => (dispatch, getState) => {
  axios
    .get(
      `http://localhost:5000/api/request/${employeeId}`,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getConfirmedRequestsByEmployee = (employeeId) => (
  dispatch,
  getState
) => {
  axios
    .get(
      `http://localhost:5000/api/request/confirmed/${employeeId}`,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const getConfirmedRequestsByEmployeeCategory = (
  employeeId,
  categoryId
) => (dispatch, getState) => {
  axios
    .get(
      `http://localhost:5000/api/request/confirmed/${employeeId}/${categoryId}`,
      tokenConfig(getState)
    )
    .then((res) =>
      dispatch({
        type: GET_REQUESTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: REQUEST_ERROR,
        payload: { msg: err.message },
      })
    );
};

export const confirmRequest = (request) => (dispatch, getState) => {
  if (
    moment(request.dateS).tz('Ameraca/Toronto').format('YYYY-MM-DD') <
    moment().tz('Ameraca/Toronto').format('YYYY-MM-DD')
  ) {
    dispatch(setAlert('Past request', 'danger'));
  } else {
    dispatch({ type: CLEAR_REQUEST });

    axios
      .put(
        `http://localhost:5000/api/request/${request._id}`,
        null,
        tokenConfig(getState)
      )
      .then((res) => {
        // Delete event from google calendar
        axios
          .delete(
            `http://localhost:5000/api/calendar/${request.user.calendarId}/${res.data.googleEventId}`,
            tokenConfig(getState)
          )
          .catch((err) =>
            dispatch({
              type: REQUEST_ERROR,
              payload: { msg: err.message },
            })
          );
        // Add event to google calendar
        axios
          .post(
            'http://localhost:5000/api/calendar',
            {
              calendarId: request.user.calendarId,
              requestId: request._id,
            },
            tokenConfig(getState)
          )
          .then((res) => dispatch(setAlert('Request confirmed', 'success')))
          .catch((err) =>
            dispatch({
              type: REQUEST_ERROR,
              payload: { msg: err.message },
            })
          );

        dispatch({
          type: GET_REQUEST,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch({
          type: REQUEST_ERROR,
          payload: { msg: err.message },
        })
      );
  }
};
