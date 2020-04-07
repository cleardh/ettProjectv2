import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import {
  getAllOrganizations,
  getOrganizationByTitle,
  addOrganization,
  deleteOrganization,
  updateOrganization,
} from '../../actions/organization';
import { getAllLevels, getLevelByTitle } from '../../actions/level';
import { getEmployeeByEmail } from '../../actions/employee';
import Loading from '../layouts/Loading';

const ManageOrg = ({
  level,
  employee,
  organization,
  getAllOrganizations,
  getOrganizationByTitle,
  addOrganization,
  deleteOrganization,
  updateOrganization,
  getAllLevels,
  getLevelByTitle,
  getEmployeeByEmail,
}) => {
  localStorage.setItem('component', 'ManageOrg');
  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations, organization.organizations]);

  useEffect(() => {
    getAllLevels();
  }, [getAllLevels]);

  useEffect(() => {
    getLevelByTitle('Company');
  }, [getLevelByTitle]);

  const [org, setOrg] = useState({
    _title: '',
    _level: '',
    _head: '',
  });
  const { _title, _level, _head } = org;

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title: _title,
      level: level.level,
      head: employee.employee,
    };
    btnText === 'Save'
      ? addOrganization(formData)
      : updateOrganization(organization.organization._id, formData);

    setOrg({ _title: '', _level: '', _head: '' });
    setBtnText('Save');
  };

  const [btnText, setBtnText] = useState('Save');

  useEffect(() => {
    if (btnText === 'Update') {
      setOrg({
        _title: organization.organization
          ? organization.organization.title
          : '',
        _level: organization.organization
          ? organization.organization.level.title
          : '',
        _head: organization.organization
          ? organization.organization.head.email
          : '',
      });
    }
  }, [btnText, organization.organization]);

  const loadOrg = (e, title) => {
    getOrganizationByTitle(title);
    setBtnText('Update');
  };

  const cancel = (e) => {
    setBtnText('Save');
    setOrg({
      _title: '',
      _level: '',
      _head: '',
    });
  };

  return (
    <Fragment>
      <AdmNavbar />
      {organization.organizations.length > 0 || !organization.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'org'} />
          <div className='admin-wrapper'>
            <form
              className='admin-form'
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <fieldset>
                <legend>Manage Organization</legend>
                <table className='table table-hover'>
                  <tbody>
                    {organization.organizations.map((o) => (
                      <Fragment key={o._id}>
                        <tr>
                          <th
                            className='org-link'
                            onClick={(e) => loadOrg(e, o.title)}
                          >
                            <em>{o.title}</em>
                          </th>
                          <td className='fw-500'>
                            <em>{o.level.title}</em>
                          </td>
                          <td align='right'>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='delete'
                              onClick={(e) => deleteOrganization(o._id)}
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
                    name='_title'
                    id='title'
                    placeholder='Enter title'
                    value={_title}
                    onChange={(e) =>
                      setOrg({ ...org, [e.target.name]: e.target.value })
                    }
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='level'>Level</label>
                  <select
                    className='form-control'
                    id='level'
                    name='_level'
                    value={_level}
                    onChange={(e) => {
                      setOrg({ ...org, [e.target.name]: e.target.value });
                      getLevelByTitle(e.target.value);
                    }}
                  >
                    {level.levels.length > 0 &&
                      level.levels.map((l) => (
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
                    value={_head}
                    onChange={(e) =>
                      setOrg({ ...org, [e.target.name]: e.target.value })
                    }
                    placeholder='Enter email'
                    onBlur={(e) =>
                      e.target.value !== '' &&
                      getEmployeeByEmail(e.target.value)
                    }
                  />
                </div>
              </fieldset>
              <button type='submit' className='btn btn-primary block'>
                {btnText}
              </button>
              <button
                type='button'
                className='btn btn-danger block'
                onClick={(e) => cancel(e)}
              >
                Cancel
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
  level: PropTypes.object,
  organization: PropTypes.object,
  employee: PropTypes.object,
  getAllOrganizations: PropTypes.func.isRequired,
  getOrganizationByTitle: PropTypes.func.isRequired,
  addOrganization: PropTypes.func.isRequired,
  deleteOrganization: PropTypes.func.isRequired,
  updateOrganization: PropTypes.func.isRequired,
  getAllLevels: PropTypes.func.isRequired,
  getLevelByTitle: PropTypes.func.isRequired,
  getEmployeeByEmail: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  level: state.level,
  organization: state.organization,
  employee: state.employee,
});

export default connect(mapStateToProps, {
  getAllOrganizations,
  getOrganizationByTitle,
  addOrganization,
  deleteOrganization,
  updateOrganization,
  getAllLevels,
  getLevelByTitle,
  getEmployeeByEmail,
})(ManageOrg);
