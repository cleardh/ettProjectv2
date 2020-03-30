import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/img/logo.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../../actions/auth';

const GrpNavbar = ({ user, logout }) => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <Link to='/dashboard/individual' className='brand-link'>
        <img
          src={logo}
          alt='Team Logo'
          className='brand-image img-circle elevation-3 logo'
        />
        <span className='navbar-brand'>ETT</span>
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarColor01'
        aria-controls='navbarColor01'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarColor01'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <Link to='/dashboard/individual' className='nav-link'>
              {' '}
              <i className='fas fa-home'></i> Home{' '}
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/about' className='nav-link'>
              <i className='fas fa-building'></i> About
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/dashboard/individual' className='nav-link'>
              <i className='fas fa-user'></i> Individual
            </Link>
          </li>
          {user && user.role.isAdmin && (
            <li className='nav-item'>
              <Link to='/admin/main' className='nav-link'>
                <i className='fas fa-cog'></i> Admin
              </Link>
            </li>
          )}
          <li className='nav-item'>
            <Link to='/' className='nav-link' onClick={() => logout()}>
              <i className='fas fa-sign-out-alt'></i> Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

GrpNavbar.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { logout })(GrpNavbar);
