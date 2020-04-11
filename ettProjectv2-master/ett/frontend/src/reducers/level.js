import {
  ADD_LEVEL,
  DELETE_LEVEL,
  GET_LEVEL,
  GET_LEVELS,
  CLEAR_LEVEL,
  LEVEL_ERROR
} from '../actions/types';

const initialState = {
  level: null,
  levels: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_LEVEL:
      return {
        ...state,
        level: payload,
        levels: state.levels.concat(payload),
        loading: false
      };
    case GET_LEVEL:
      return {
        ...state,
        level: payload,
        loading: false
      };
    case DELETE_LEVEL:
      return {
        ...state,
        levels: state.levels.filter(level => level.id !== payload.id),
        loading: false
      };
    case GET_LEVELS:
      return {
        ...state,
        levels: payload,
        loading: false
      };
    case CLEAR_LEVEL:
      return {
        ...state,
        level: null,
        loading: false
      };
    case LEVEL_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
