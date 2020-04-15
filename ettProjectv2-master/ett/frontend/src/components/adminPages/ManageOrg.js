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
    _email: '',
  });
  const { _title, _level, _email } = org;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    displayDelete: 'none',
    selectedOrg: null,
  });
  const { displayDelete, selectedOrg } = showDeleteConfirm;

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title: _title,
      level: level.level,
      email: _email,
    };
    btnText === 'Save'
      ? addOrganization(formData)
      : updateOrganization(organization.organization._id, formData);

    setOrg({ _title: '', _level: '', _email: '' });
    setBtnText('Save');
  };

  const [btnText, setBtnText] = useState('Save');

  useEffect(() => {
    if (btnText === 'Update') {
      setOrg({
        _title: organization.organization
          ? organization.organization.title
          : '',
        _level:
          organization.organization && organization.organization.level
            ? organization.organization.level.title
            : '',
        _email: organization.organization
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
      _email: '',
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
                            <div className='fw-500'>{o.title}</div>
                          </th>
                          <td>
                            <div className='fw-500'>
                              {o.level ? (
                                o.level.title
                              ) : (
                                <div style={{ color: 'var(--secondary)' }}>
                                  Please select level
                                </div>
                              )}
                            </div>
                          </td>
                          <td align='right'>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='delete'
                              onClick={(e) =>
                                setShowDeleteConfirm({
                                  displayDelete: 'block',
                                  selectedOrg: o,
                                })
                              }
                            >
                              <i className='far fa-trash-alt'></i>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                {/* Toast Confirm Delete */}
                {selectedOrg && (
                  <div
                    className='toast show admin-confirm'
                    role='alert'
                    aria-live='assertive'
                    aria-atomic='true'
                    style={{ display: displayDelete }}
                  >
                    <div className='toast-header'>
                      <strong className='mr-auto'>Confirm</strong>
                      <button
                        type='button'
                        className='ml-2 mb-1 close'
                        data-dismiss='toast'
                        aria-label='Close'
                        onClick={(e) =>
                          setShowDeleteConfirm({
                            displayDelete: 'none',
                            selectedOrg: null,
                          })
                        }
                      >
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                    <div className='toast-body'>
                      <div className='delete-msg'>
                        {`Do you really want to delele ${selectedOrg.title} organization?`}
                      </div>
                      <div>
                        <button
                          type='button'
                          className='btn btn-danger btn-lg btn-block'
                          onClick={(e) => {
                            deleteOrganization(selectedOrg._id);
                            setShowDeleteConfirm({
                              displayDelete: 'none',
                              selectedOrg: null,
                            });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Toast Confirm Delete */}

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
                    name='_email'
                    value={_email}
                    onChange={(e) =>
                      setOrg({ ...org, [e.target.name]: e.target.value })
                    }
                    placeholder='Enter email'
                  />
                </div>
              </fieldset>
              <button
                type='submit'
                className='btn btn-primary block'
                disabled={_title === '' || _email === '' ? true : false}
              >
                {btnText}
              </button>
              <button
                type='button'
                className='btn btn-danger block'
                onClick={(e) => cancel(e)}
                disabled={_title === '' && _email === '' ? true : false}
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
})(ManageOrg);
