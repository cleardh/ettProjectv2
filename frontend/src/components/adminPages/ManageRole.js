import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import { addRole, deleteRole, getAllRoles } from '../../actions/role';

const ManageRole = ({
  history,
  user,
  role,
  addRole,
  deleteRole,
  getAllRoles
}) => {
  if (user && !user.role.isAdmin) {
    history.push('/dashboard/individual');
  }

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles, role.roles.length]);

  const [newRole, setNewRole] = useState({
    title: '',
    isAdmin: false
  });
  const { title, isAdmin } = newRole;

  const onChange = e =>
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
                {role.roles.map(r => (
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
                          onClick={e => deleteRole(r._id)}
                        >
                          <i className='far fa-trash-alt'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <hr />
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Add role'
                    name='title'
                    value={title}
                    onChange={e => onChange(e)}
                  />
                  <div className='input-group-append'>
                    <div className='custom-control custom-switch toggle-container'>
                      <input
                        type='checkbox'
                        className='custom-control-input'
                        id='toggleAdmin'
                        name='isAdmin'
                        checked={isAdmin ? true : false}
                        onChange={e =>
                          setNewRole({
                            ...newRole,
                            isAdmin: !isAdmin
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
                      onClick={e => {
                        addRole(newRole);
                        setNewRole({
                          title: '',
                          isAdmin: false
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
  user: PropTypes.object,
  role: PropTypes.object,
  addRole: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  getAllRoles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user,
  role: state.role
});

export default connect(mapStateToProps, { addRole, getAllRoles, deleteRole })(
  withRouter(ManageRole)
);
