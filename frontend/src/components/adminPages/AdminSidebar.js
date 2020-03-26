import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminSidebar = ({
  current,
  auth: { token, isAuthenticated, user },
  history
}) => {
  if (!isAuthenticated && !token && !localStorage.token && !user) {
    history.push('/');
  } else if (user && !user.role.isAdmin) {
    history.push('/dashboard/individual');
  }

  return (
    <Fragment>
      <nav id='sidebar'>
        <ul className='list-unstyled components'>
          <li
            className={current === 'main' ? 'admin-list active' : 'admin-list'}
          >
            <Link to='/admin/main'>MAIN</Link>
          </li>
          <li
            className={current === 'role' ? 'admin-list active' : 'admin-list'}
          >
            <Link to='/admin/manage-role'>MANAGE ROLE</Link>
          </li>
          <li
            className={current === 'job' ? 'admin-list active' : 'admin-list'}
          >
            <Link to='/admin/manage-job'>MANAGE JOB</Link>
          </li>
          <li
            className={
              current === 'employee' ? 'admin-list active' : 'admin-list'
            }
          >
            <Link to='/admin/manage-employee'>MANAGE EMPLOYEE</Link>
          </li>
          <li
            className={
              current === 'category' ? 'admin-list active' : 'admin-list'
            }
          >
            <Link to='/admin/manage-category'>MANAGE CATEGORY</Link>
          </li>
          <li
            className={current === 'level' ? 'admin-list active' : 'admin-list'}
          >
            <Link to='/admin/manage-level'>MANAGE ORG LEVEL</Link>
          </li>
          <li
            className={current === 'org' ? 'admin-list active' : 'admin-list'}
          >
            <Link to='/admin/manage-organization'>MANAGE ORGANIZATION</Link>
          </li>
          <li
            className={
              current === 'report' ? 'admin-list active' : 'admin-list'
            }
          >
            <Link to='/admin/report'>GENERATE REPORT</Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

AdminSidebar.propTypes = {
  auth: PropTypes.object,
  current: PropTypes.string
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(AdminSidebar));
