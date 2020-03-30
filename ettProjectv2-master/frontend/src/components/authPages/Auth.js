import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { authenticate } from '../../actions/auth';
import Loading from '../layouts/Loading';

const Auth = ({ auth, authenticate }) => {
  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (auth.user) {
    if (auth.user.calendarId === '') {
      return <Redirect to='/register' />;
    } else {
      switch (localStorage.getItem('component')) {
        case 'About':
          return <Redirect to='/about' />;
        case 'GrpDashboard':
          return <Redirect to='/dashboard/group' />;
        case 'AdminMain':
          return <Redirect to='/admin/main' />;
        case 'ManageCategory':
          return <Redirect to='/admin/manage-category' />;
        case 'ManageEmployee':
          return <Redirect to='/admin/manage-employee' />;
        case 'ManageJob':
          return <Redirect to='/admin/manage-job' />;
        case 'ManageLevel':
          return <Redirect to='/admin/manage-level' />;
        case 'ManageOrg':
          return <Redirect to='/admin/manage-organization' />;
        case 'ManageRole':
          return <Redirect to='/admin/manage-role' />;
        case 'Report':
          return <Redirect to='/admin/report' />;
        default:
          return <Redirect to='/dashboard/individual' />;
      }
    }
  } else {
    return <Loading />;
  }
};

Auth.propTypes = {
  authenticate: PropTypes.func.isRequired,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { authenticate })(Auth);
