import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import { addRole, deleteRole, getAllRoles } from '../../actions/role';

const ManageRole = ({ role, addRole, deleteRole, getAllRoles }) => {
  localStorage.setItem('component', 'ManageRole');
  useEffect(() => {
    getAllRoles();
  }, [getAllRoles, role.roles.length]);

  const [newRole, setNewRole] = useState({
    title: '',
    isAdmin: false,
  });
  const { title, isAdmin } = newRole;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    displayDelete: 'none',
    selectedRole: null,
  });
  const { displayDelete, selectedRole } = showDeleteConfirm;

  const onChange = (e) =>
    setNewRole({ ...newRole, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <AdmNavbar />
      {role.roles.length > 0 || !role.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'role'} />
          <div className='admin-wrapper'>
            <form className='admin-form'>
              <fieldset>
                <legend>Manage Role</legend>
                {role.roles.map((r) => (
                  <div key={r._id}>
                    <div className='input-group mb-3'>
                      <input
                        type='text'
                        className='form-control'
                        value={r.title}
                        readOnly
                      />
                      <div className='input-group-append'>
                        <div className='custom-control custom-switch toggle-container'>
                          <input
                            type='checkbox'
                            className='custom-control-input'
                            name='isAdmin'
                            checked={r.isAdmin ? true : false}
                            readOnly
                          />
                          <label className='custom-control-label'></label>
                        </div>
                        <button
                          className='btn btn-outline-secondary btn-admin'
                          type='button'
                          name={r.title}
                          onClick={(e) =>
                            setShowDeleteConfirm({
                              displayDelete: 'block',
                              selectedRole: r,
                            })
                          }
                        >
                          <i className='far fa-trash-alt'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Toast Confirm Delete */}
                {selectedRole && (
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
                            selectedRole: null,
                          })
                        }
                      >
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                    <div className='toast-body'>
                      <div className='delete-msg'>
                        {`Do you really want to delele ${selectedRole.title} role?`}
                      </div>
                      <div>
                        <button
                          type='button'
                          className='btn btn-danger btn-lg btn-block'
                          onClick={(e) => {
                            deleteRole(selectedRole._id);
                            setShowDeleteConfirm({
                              displayDelete: 'none',
                              selectedRole: null,
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
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Add role'
                    name='title'
                    value={title}
                    onChange={(e) => onChange(e)}
                  />
                  <div className='input-group-append'>
                    <div className='custom-control custom-switch toggle-container'>
                      <input
                        type='checkbox'
                        className='custom-control-input'
                        id='toggleAdmin'
                        name='isAdmin'
                        checked={isAdmin ? true : false}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            isAdmin: !isAdmin,
                          })
                        }
                      />
                      <label
                        className='custom-control-label'
                        htmlFor='toggleAdmin'
                      ></label>
                    </div>
                    <button
                      className='btn btn-outline-secondary btn-add'
                      type='button'
                      name='new_role'
                      onClick={(e) => {
                        addRole(newRole);
                        setNewRole({
                          title: '',
                          isAdmin: false,
                        });
                      }}
                    >
                      <i className='fas fa-plus'></i>
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

ManageRole.propTypes = {
  role: PropTypes.object,
  addRole: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  getAllRoles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.role,
});

export default connect(mapStateToProps, { addRole, getAllRoles, deleteRole })(
  ManageRole
);
