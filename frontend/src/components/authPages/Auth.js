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
    console.log(auth.user);

    if (auth.user.calendarId === '') {
      return <Redirect to='/register' />;
    } else {
      return <Redirect to='/dashboard/individual' />;
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
