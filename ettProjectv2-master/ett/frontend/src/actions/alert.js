import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, type, timeout = 2000) => (dispatch) => {
  const id = uuid();
  const res = { data: { id, msg, type } };

  dispatch({
    type: SET_ALERT,
    payload: res.data,
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: res.data,
    });
  }, timeout);
};
