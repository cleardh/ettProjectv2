import {
  ADD_ORGANIZATION,
  DELETE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  GET_ORGANIZATION,
  GET_ORGANIZATIONS,
  GET_MEMBER_ORGANIZATIONS,
  ADD_MEMBER,
  DELETE_MEMBER,
  CLEAR_ORGANIZATION,
  ORGANIZATION_ERROR
} from '../actions/types';

const initialState = {
  organization: null,
  organizations: [],
  memberOrganizations: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_ORGANIZATION:
      return {
        ...state,
        organization: payload,
        organizations: state.organizations.concat(payload),
        loading: false
      };
    case GET_ORGANIZATION:
      return {
        ...state,
        organization: payload,
        loading: false
      };
    case GET_MEMBER_ORGANIZATIONS:
      return {
        ...state,
        memberOrganizations: payload,
        loading: false
      };
    case ADD_MEMBER:
      return {
        ...state,
        memberOrganizations: state.memberOrganizations.concat(payload),
        loading: false
      };
    case DELETE_MEMBER:
      return {
        ...state,
        memberOrganizations: state.memberOrganizations.filter(
          o => o.id !== payload.id
        ),
        loading: false
      };
    case DELETE_ORGANIZATION:
      return {
        ...state,
        organizations: state.organizations.filter(
          organization => organization.id !== payload.id
        ),
        loading: false
      };
    case UPDATE_ORGANIZATION:
      return {
        ...state,
        organization: payload,
        loading: false
      };
    case GET_ORGANIZATIONS:
      return {
        ...state,
        organizations: payload,
        loading: false
      };
    case CLEAR_ORGANIZATION:
      return {
        ...state,
        organization: null,
        loading: false
      };
    case ORGANIZATION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
