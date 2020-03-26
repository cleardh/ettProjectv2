import {
  ADD_ROLE,
  DELETE_ROLE,
  GET_ROLE,
  GET_ROLES,
  CLEAR_ROLE,
  ROLE_ERROR
} from '../actions/types';

const initialState = {
  role: null,
  roles: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_ROLE:
      return {
        ...state,
        role: payload,
        roles: state.roles.concat(payload),
        loading: false
      };
    case GET_ROLE:
      return {
        ...state,
        role: payload,
        loading: false
      };
    case DELETE_ROLE:
      return {
        ...state,
        roles: state.roles.filter(role => role.id !== payload.id),
        loading: false
      };
    case GET_ROLES:
      return {
        ...state,
        roles: payload,
        loading: false
      };
    case CLEAR_ROLE:
      return {
        ...state,
        role: null,
        loading: false
      };
    case ROLE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
