import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import {
  getAllEmployees,
  getEmployeeByEmail,
  updateEmployee,
} from '../../actions/employee';
import { getAllRoles, getRoleByTitle } from '../../actions/role';
import { getAllJobs, getJobByTitle } from '../../actions/job';
import {
  getAllOrganizations,
  getOrganizationsByMember,
  getOrganizationByTitle,
  addMemberToOrganization,
  deleteMemberFromOrganization,
  clearMemberOrganizations,
} from '../../actions/organization';
import { setAlert } from '../../actions/alert';

const ManageEmployee = ({
  role,
  job,
  employee,
  organization,
  getAllRoles,
  getAllJobs,
  getRoleByTitle,
  getJobByTitle,
  getAllEmployees,
  getEmployeeByEmail,
  updateEmployee,
  getAllOrganizations,
  getOrganizationsByMember,
  getOrganizationByTitle,
  addMemberToOrganization,
  deleteMemberFromOrganization,
  clearMemberOrganizations,
  setAlert,
}) => {
  localStorage.setItem('component', 'ManageEmployee');

  useEffect(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  useEffect(() => {
    getAllJobs();
  }, [getAllJobs]);

  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations]);

  useEffect(() => {
    if (employee.employee) {
      getOrganizationsByMember(employee.employee.email);
    }
  }, [
    getOrganizationsByMember,
    employee.employee,
    organization.memberOrganizations,
  ]);

  const [org, setOrg] = useState('Operations');

  useEffect(() => {
    getOrganizationByTitle(org);
  }, [getOrganizationByTitle, org]);

  useEffect(() => {
    if (employee.employee) {
      setEmp({
        _firstName: employee.employee.firstName
          ? employee.employee.firstName
          : '',
        _lastName: employee.employee.lastName ? employee.employee.lastName : '',
        _email: employee.employee.email ? employee.employee.email : '',
        _role: employee.employee.role ? employee.employee.role.title : '',
        _job: employee.employee.job ? employee.employee.job.title : '',
        _dateHired: employee.employee.dateHired
          ? employee.employee.dateHired
          : '',
        _phone: employee.employee.phone ? employee.employee.phone : '',
        _calendarId: employee.employee.calendarId
          ? employee.employee.calendarId
          : '',
        _image: employee.employee.image ? employee.employee.image : '',
      });
    } else {
      setEmp({
        _firstName: '',
        _lastName: '',
        _email: '',
        _role: '',
        _job: '',
        _dateHired: '',
        _phone: '',
        _calendarId: '',
      });
      clearMemberOrganizations();
    }
  }, [employee.employee, clearMemberOrganizations]);

  const [emp, setEmp] = useState({
    _firstName: '',
    _lastName: '',
    _email: '',
    _role: '',
    _job: '',
    _dateHired: '',
    _phone: '',
    _calendarId: '',
    _image: '',
  });

  const {
    _firstName,
    _lastName,
    _email,
    _role,
    _job,
    _dateHired,
    _phone,
    _calendarId,
    _image,
  } = emp;

  useEffect(() => {
    _role ? getRoleByTitle(_role) : getRoleByTitle('Employee');
  }, [getRoleByTitle, _role]);

  useEffect(() => {
    _job ? getJobByTitle(_job) : getJobByTitle('Software Developer');
  }, [getJobByTitle, _job]);

  const onChange = (e) => {
    setEmp({
      ...emp,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      employee.employees.filter(
        (emp) => emp.calendarId === _calendarId && emp.email !== _email
      ).length > 0
    ) {
      setAlert('Invalid Calendar ID', 'danger');
    } else {
      const formData = {
        firstName: _firstName,
        lastName: _lastName,
        email: _email,
        role: role.role ? role.role : employee.employee.role,
        job: job.job ? job.job : employee.employee.job,
        dateHired: _dateHired,
        phone: _phone,
        calendarId: _calendarId,
        image: _image,
      };
      updateEmployee(formData, employee.employee._id);
      setAlert('Employee Information saved successfully', 'success');
    }
  };

  const addMember = (e) => {
    if (employee.employee) {
      addMemberToOrganization(organization.organization._id, {
        member: employee.employee,
      });
    }
  };

  const deleteMember = (e, org) => {
    if (employee.employee) {
      deleteMemberFromOrganization(org._id, employee.employee.email);
    }
  };

  return (
    <Fragment>
      <AdmNavbar />
      <div className='wrapper'>
        <AdminSidebar current={'employee'} />
        <div className='admin-wrapper'>
          <form className='admin-form' onSubmit={(e) => onSubmit(e)}>
            <fieldset>
              <legend>Manage Employee</legend>
              <div className='form-group'>
                <label htmlFor='email'>Email address</label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  aria-describedby='email'
                  placeholder='Enter employee email address'
                  name='_email'
                  value={_email}
                  onChange={(e) => onChange(e)}
                />

                <button
                  type='button'
                  className='btn btn-primary block search'
                  onClick={(e) => getEmployeeByEmail(_email)}
                  disabled={_email === '' ? true : false}
                >
                  Search
                </button>
              </div>
              <div className='form-group'>
                <label htmlFor='role'>Role</label>
                <select
                  className='form-control'
                  id='role'
                  name='_role'
                  value={_role}
                  onChange={(e) => {
                    onChange(e);
                  }}
                >
                  {role.roles.length > 0 &&
                    role.roles.map((r) => (
                      <option key={r._id} value={r.title}>
                        {r.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='job'>Job</label>
                <select
                  className='form-control'
                  id='job'
                  name='_job'
                  value={_job}
                  onChange={(e) => {
                    onChange(e);
                  }}
                >
                  {job.jobs.length > 0 &&
                    job.jobs.map((j) => (
                      <option key={j._id} value={j.title}>
                        {j.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor='dateHired'>Date Hired</label>
                <input
                  type='date'
                  className='form-control'
                  name='_dateHired'
                  id='dateHired'
                  value={moment(_dateHired).add(1, 'days').format('YYYY-MM-DD')}
                  onChange={(e) =>
                    setEmp({
                      ...emp,
                      _dateHired: moment(e.target.value),
                    })
                  }
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone'>Phone</label>
                <input
                  type='text'
                  className='form-control'
                  name='_phone'
                  value={_phone}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='job'>Calendar ID</label>
                <input
                  type='text'
                  className='form-control'
                  name='_calendarId'
                  value={_calendarId}
                  onChange={(e) => onChange(e)}
                />
              </div>

              {/* Organizations */}
              <div className='form-g'>
                <label htmlFor='organization'>Organizations</label>
                <table className='table table-hover'>
                  <tbody>
                    {employee.employee &&
                      organization.memberOrganizations &&
                      organization.memberOrganizations.map((mo) => (
                        <Fragment key={mo._id}>
                          <tr>
                            <td>{mo.title}</td>
                            <td align='right'>
                              <button
                                className='btn btn-outline-secondary btn-admin'
                                type='button'
                                name='delete'
                                onClick={(e) => deleteMember(e, mo)}
                              >
                                <i className='far fa-trash-alt'></i>
                              </button>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    <tr>
                      <td align='left'>
                        <div className='form-group'>
                          <select
                            className='form-control'
                            id='org'
                            name='org'
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                          >
                            {organization.organizations &&
                              organization.organizations.map((o) => (
                                <option key={o._id} value={o.title}>
                                  {o.title}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                      <td align='right'>
                        <button
                          className='btn btn-outline-secondary btn-add'
                          type='button'
                          name='addMember'
                          disabled={!employee.employee && true}
                          onClick={(e) => addMember(e)}
                        >
                          <i className='fas fa-plus'></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>
            <button
              type='submit'
              className='btn btn-primary block'
              disabled={!employee.employee && true}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

ManageEmployee.propTypes = {
  user: PropTypes.object,
  role: PropTypes.object,
  job: PropTypes.object,
  employee: PropTypes.object,
  organization: PropTypes.object,
  getAllJobs: PropTypes.func.isRequired,
  getAllRoles: PropTypes.func.isRequired,
  getRoleByTitle: PropTypes.func.isRequired,
  getJobByTitle: PropTypes.func.isRequired,
  getAllEmployees: PropTypes.func.isRequired,
  getEmployeeByEmail: PropTypes.func.isRequired,
  updateEmployee: PropTypes.func.isRequired,
  getAllOrganizations: PropTypes.func.isRequired,
  getOrganizationsByMember: PropTypes.func.isRequired,
  getOrganizationByTitle: PropTypes.func.isRequired,
  addMemberToOrganization: PropTypes.func.isRequired,
  deleteMemberFromOrganization: PropTypes.func.isRequired,
  clearMemberOrganizations: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.role,
  job: state.job,
  employee: state.employee,
  organization: state.organization,
});

export default connect(mapStateToProps, {
  getAllJobs,
  getAllRoles,
  getRoleByTitle,
  getJobByTitle,
  getAllEmployees,
  getEmployeeByEmail,
  updateEmployee,
  getAllOrganizations,
  getOrganizationsByMember,
  getOrganizationByTitle,
  addMemberToOrganization,
  deleteMemberFromOrganization,
  clearMemberOrganizations,
  setAlert,
})(ManageEmployee);
