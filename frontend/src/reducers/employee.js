import {
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  GET_EMPLOYEE,
  GET_EMPLOYEES,
  CLEAR_EMPLOYEE,
  EMPLOYEE_ERROR
} from '../actions/types';

const initialState = {
  employee: null,
  employees: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_EMPLOYEE:
    case GET_EMPLOYEE:
      return {
        ...state,
        employee: payload,
        loading: false
      };
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        loading: false
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(
          employee => employee.id !== payload.id
        ),
        loading: false
      };
    case GET_EMPLOYEES:
      return {
        ...state,
        employees: payload,
        loading: false
      };
    case CLEAR_EMPLOYEE:
      return {
        ...state,
        employee: null,
        loading: false
      };
    case EMPLOYEE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
