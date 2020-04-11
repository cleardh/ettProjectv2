import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { authenticate } from '../../actions/auth';
import Loading from '../layouts/Loading';
import { setAlert } from '../../actions/alert';

const Auth = ({ auth, authenticate, setAlert }) => {
  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (auth.user) {
    if (!auth.user.calendarId) {
      setAlert('Please Fill Out Registration Form Below', 'info');
      return <Redirect to='/register' />;
    } else if (!auth.user.role || !auth.user.job) {
      auth.user.job
        ? setAlert('Please Select Your Role', 'warning')
        : auth.user.role
        ? setAlert('Please Select Your Job', 'warning')
        : setAlert('Please Select Your Role & Job', 'warning');
      return (
        <Redirect
          to={{
            pathname: '/register',
            state: { userinfo: auth.user },
          }}
        />
      );
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
  auth: PropTypes.object,
  authenticate: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { authenticate, setAlert })(Auth);
