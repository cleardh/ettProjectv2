import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import {
  getAllOrganizations,
  getOrganizationsByHead,
  addOrganization,
  deleteOrganization
} from '../../actions/organization';
import { getAllLevels, getLevelByTitle } from '../../actions/level';
import { getEmployeeByEmail } from '../../actions/employee';
import Loading from '../layouts/Loading';

const ManageOrg = ({
  history,
  user,
  level,
  employee,
  organization,
  getAllOrganizations,
  getOrganizationsByHead,
  addOrganization,
  deleteOrganization,
  getAllLevels,
  getLevelByTitle,
  getEmployeeByEmail
}) => {
  if (user && !user.role.isAdmin) {
    history.push('/dashboard/individual');
  }

  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations, organization.organizations.length]);

  useEffect(() => {
    getAllLevels();
  }, [getAllLevels]);

  useEffect(() => {
    getLevelByTitle('Company');
  }, [getLevelByTitle]);

  const [title, setTitle] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    const formData = {
      title,
      level: level.level,
      head: employee.employee
    };
    addOrganization(formData);
  };

  return (
    <Fragment>
      <AdmNavbar />
      {organization.organizations.length > 0 || !organization.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'org'} />
          <div className='admin-wrapper'>
            <form className='admin-form' onSubmit={e => onSubmit(e)}>
              <fieldset>
                <legend>Manage Organization</legend>
                <table className='table table-hover'>
                  <tbody>
                    {organization.organizations.map(o => (
                      <Fragment key={o._id}>
                        <tr>
                          <td>
                            <em>{o.title}</em>
                          </td>
                          <td>
                            <em>{o.level.title}</em>
                          </td>
                          <td align='right'>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='delete'
                              onClick={e => deleteOrganization(o._id)}
                            >
                              <i className='far fa-trash-alt'></i>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
                <hr />
                <div className='form-group'>
                  <label htmlFor='title'>Title</label>
                  <input
                    type='text'
                    className='form-control'
                    name='title'
                    id='title'
                    placeholder='Enter title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='level'>Level</label>
                  <select
                    className='form-control'
                    id='level'
                    name='_level'
                    onChange={e => getLevelByTitle(e.target.value)}
                  >
                    {level.levels.length > 0 &&
                      level.levels.map(l => (
                        <option key={l._id} value={l.title}>
                          {l.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label htmlFor='head'>Head</label>
                  <input
                    type='text'
                    className='form-control'
                    id='head'
                    name='_head'
                    placeholder='Enter email'
                    onBlur={e =>
                      e.target.value !== '' &&
                      getEmployeeByEmail(e.target.value)
                    }
                  />
                </div>
              </fieldset>
              <button type='submit' className='btn btn-primary block'>
                Save
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

ManageOrg.propTypes = {
  user: PropTypes.object,
  level: PropTypes.object,
  organization: PropTypes.object,
  employee: PropTypes.object,
  getAllOrganizations: PropTypes.func.isRequired,
  addOrganization: PropTypes.func.isRequired,
  deleteOrganization: PropTypes.func.isRequired,
  getOrganizationsByHead: PropTypes.func.isRequired,
  getAllLevels: PropTypes.func.isRequired,
  getLevelByTitle: PropTypes.func.isRequired,
  getEmployeeByEmail: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  level: state.level,
  organization: state.organization,
  employee: state.employee
});

export default connect(mapStateToProps, {
  getAllOrganizations,
  addOrganization,
  deleteOrganization,
  getOrganizationsByHead,
  getAllLevels,
  getLevelByTitle,
  getEmployeeByEmail
})(withRouter(ManageOrg));
