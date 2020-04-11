import {
  ADD_JOB,
  DELETE_JOB,
  GET_JOB,
  GET_JOBS,
  CLEAR_JOB,
  JOB_ERROR
} from '../actions/types';

const initialState = {
  job: null,
  jobs: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_JOB:
      return {
        ...state,
        job: payload,
        jobs: state.jobs.concat(payload),
        loading: false
      };
    case GET_JOB:
      return {
        ...state,
        job: payload,
        loading: false
      };
    case DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== payload.id),
        loading: false
      };
    case GET_JOBS:
      return {
        ...state,
        jobs: payload,
        loading: false
      };
    case CLEAR_JOB:
      return {
        ...state,
        job: null,
        loading: false
      };
    case JOB_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
