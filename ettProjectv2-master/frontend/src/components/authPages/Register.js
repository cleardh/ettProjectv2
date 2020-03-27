import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import background_calendar from '../../assets/img/background_calendar.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../layouts/Loading';
import { getAllJobs, getJobByTitle } from '../../actions/job';
import { getAllRoles, getRoleByTitle } from '../../actions/role';
import { register, logout } from '../../actions/auth';

const Register = ({
  job,
  role,
  user,
  getAllJobs,
  getAllRoles,
  getJobByTitle,
  getRoleByTitle,
  register,
  logout,
  history
}) => {
  useEffect(() => {
    getAllJobs();
  }, [getAllJobs]);

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  if (!user) {
    history.push('/');
  }

  const [formData, setFormData] = useState({
    _role: '',
    _job: '',
    _dateHired: '',
    _phone: '',
    _calendarId: ''
  });

  const { _role, _job, _dateHired, _phone, _calendarId } = formData;

  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = e => {
    e.preventDefault();
    const body = {
      role: role.role,
      job: job.job,
      dateHired: _dateHired,
      phone: _phone,
      calendarId: _calendarId
    };
    register(body, user._id, history);
  };

  return (
    <Fragment>
      {job.jobs.length > 0 && role.roles.length > 0 ? (
        <Fragment>
          <div className='container'>
            <div className='img-wrapper'>
              <img src={background_calendar} alt='background calendar' />
            </div>
            <div className='sign-up-wrapper'>
              <form className='signup-form' onSubmit={e => onSubmit(e)}>
                <fieldset>
                  <legend>SIGN UP</legend>
                  <div className='form-group'>
                    <label>Role</label>
                    <select
                      className='form-control'
                      name='_role'
                      value={_role}
                      onChange={e => {
                        setFormData({ ...formData, _role: e.target.value });
                        getRoleByTitle(e.target.value);
                      }}
                    >
                      <option>-</option>
                      {role.roles.map(r => (
                        <option key={r._id} value={r.title}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Job</label>
                    <select
                      className='form-control'
                      name='_job'
                      value={_job}
                      onChange={e => {
                        setFormData({ ...formData, _job: e.target.value });
                        getJobByTitle(e.target.value);
                      }}
                    >
                      <option>-</option>
                      {job.jobs.map(j => (
                        <option key={j._id} value={j.title}>
                          {j.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='form-group'>
                    <label>Date Hired</label>
                    <input
                      type='date'
                      className='form-control'
                      name='_dateHired'
                      value={_dateHired}
                      onChange={e => onChange(e)}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Phone</label>
                    <input
                      type='text'
                      className='form-control'
                      name='_phone'
                      placeholder='000-000-0000'
                      value={_phone}
                      onChange={e => onChange(e)}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Calendar ID</label>
                    <input
                      type='text'
                      className='form-control'
                      name='_calendarId'
                      placeholder='Your Public Google Calendar ID'
                      value={_calendarId}
                      onChange={e => onChange(e)}
                    />
                  </div>
                </fieldset>
                <button type='submit' className='btn btn-primary block'>
                  Submit
                </button>
                <button
                  type='button'
                  className='btn btn-danger block'
                  onClick={e => logout()}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
          <div className='overlay'></div>
          <footer className='landing-footer'>&copy; 2020 Team DJK</footer>;
        </Fragment>
      ) : (
        <Fragment>
          <Loading />
        </Fragment>
      )}
    </Fragment>
  );
};

Register.propTypes = {
  getAllJobs: PropTypes.func.isRequired,
  getAllRoles: PropTypes.func.isRequired,
  getRoleByTitle: PropTypes.func.isRequired,
  getJobByTitle: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired,
  role: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  job: state.job,
  role: state.role,
  user: state.auth.user
});

export default connect(mapStateToProps, {
  getAllJobs,
  getAllRoles,
  getRoleByTitle,
  getJobByTitle,
  register,
  logout
})(withRouter(Register));
