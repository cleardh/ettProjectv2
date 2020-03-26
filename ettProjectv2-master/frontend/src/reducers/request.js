import {
  ADD_REQUEST,
  DELETE_REQUEST,
  GET_REQUEST,
  GET_REQUESTS,
  CLEAR_REQUEST,
  REQUEST_ERROR
} from '../actions/types';

const initialState = {
  request: null,
  requests: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_REQUEST:
      return {
        ...state,
        request: payload,
        requests: state.requests.concat(payload),
        loading: false
      };
    case GET_REQUEST:
      return {
        ...state,
        request: payload,
        loading: false
      };
    case DELETE_REQUEST:
      return {
        ...state,
        requests: state.requests.filter(request => request.id !== payload.id),
        loading: false
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: payload,
        loading: false
      };
    case CLEAR_REQUEST:
      return {
        ...state,
        request: null,
        loading: false
      };
    case REQUEST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
