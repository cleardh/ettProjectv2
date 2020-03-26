import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import google_sign_in from '../../assets/img/google_sign_in.png';
import google_sign_in_pressed from '../../assets/img/google_sign_in_pressed.png';
import background_calendar from '../../assets/img/background_calendar.png';

function Landing({ login, isAuthenticated }) {
  const onClick = e => {
    login();
  };

  if (isAuthenticated) {
    return <Redirect to='/auth' />;
  }

  return (
    <Fragment>
      <div className='container'>
        <div className='img-wrapper'>
          <img src={background_calendar} alt='background calendar' />
        </div>

        <div className='title'>
          <h1>
            <i className='fas fa-calendar-alt'></i>&nbsp;Employee Time-off
            Tracker
          </h1>
        </div>
        <div className='signin'>
          <img
            onMouseOver={e => (e.currentTarget.src = google_sign_in_pressed)}
            onMouseOut={e => (e.currentTarget.src = google_sign_in)}
            onClick={e => onClick(e)}
            src={google_sign_in}
            width='220rem'
            alt='google sign in'
          />
        </div>
      </div>
      <div className='overlay'></div>
    </Fragment>
  );
}

Landing.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Landing);
