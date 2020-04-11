import {
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORIES,
  CLEAR_CATEGORY,
  CATEGORY_ERROR
} from '../actions/types';

const initialState = {
  category: null,
  categories: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_CATEGORY:
      return {
        ...state,
        category: payload,
        categories: state.categories.concat(payload),
        loading: false
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        category: payload,
        loading: false
      };
    case GET_CATEGORY:
      return {
        ...state,
        category: payload,
        loading: false
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id !== payload.id
        ),
        loading: false
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload,
        loading: false
      };
    case CLEAR_CATEGORY:
      return {
        ...state,
        category: null,
        loading: false
      };
    case CATEGORY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
