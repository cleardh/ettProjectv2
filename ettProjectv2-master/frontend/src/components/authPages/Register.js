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
  const [validationClass, setValidationClass] = useState({
    validateRole: 'form-control',
    validateJob: 'form-control',
    validateDateHired: 'form-control',
    validatePhone: 'form-control',
    validateCalendarId: 'form-control'
  });
  const {
    validateRole,
    validateJob,
    validateDateHired,
    validatePhone,
    validateCalendarId
  } = validationClass;

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
  console.log(formData);

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
                      className={validateRole}
                      name='_role'
                      value={_role}
                      onBlur={e =>
                        _role === ''
                          ? setValidationClass({
                              ...validationClass,
                              validateRole: 'form-control is-invalid'
                            })
                          : setValidationClass({
                              ...validationClass,
                              validateRole: 'form-control'
                            })
                      }
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
                    <div className='invalid-feedback'>Role is required</div>
                  </div>

                  <div className='form-group'>
                    <label>Job</label>
                    <select
                      className={validateJob}
                      name='_job'
                      value={_job}
                      onBlur={e =>
                        _job === ''
                          ? setValidationClass({
                              ...validationClass,
                              validateJob: 'form-control is-invalid'
                            })
                          : setValidationClass({
                              ...validationClass,
                              validateJob: 'form-control'
                            })
                      }
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
                    <div className='invalid-feedback'>Job is required</div>
                  </div>

                  <div className='form-group'>
                    <label>Date Hired</label>
                    <input
                      type='date'
                      className={validateDateHired}
                      name='_dateHired'
                      value={_dateHired}
                      onBlur={e =>
                        _dateHired === ''
                          ? setValidationClass({
                              ...validationClass,
                              validateDateHired: 'form-control is-invalid'
                            })
                          : setValidationClass({
                              ...validationClass,
                              validateDateHired: 'form-control'
                            })
                      }
                      onChange={e => onChange(e)}
                    />
                    <div className='invalid-feedback'>
                      Date Hired is required
                    </div>
                  </div>

                  <div className='form-group'>
                    <label>Phone</label>
                    <input
                      type='text'
                      className={validatePhone}
                      name='_phone'
                      placeholder='000-000-0000'
                      value={_phone}
                      onBlur={e =>
                        _phone === ''
                          ? setValidationClass({
                              ...validationClass,
                              validatePhone: 'form-control is-invalid'
                            })
                          : setValidationClass({
                              ...validationClass,
                              validatePhone: 'form-control'
                            })
                      }
                      onChange={e => onChange(e)}
                    />
                    <div className='invalid-feedback'>Phone is required</div>
                  </div>

                  <span className='form-group'>
                    <label>
                      Calendar ID{' '}
                      <span
                        className='google-calendar-link'
                        onClick={() =>
                          window.open('https://calendar.google.com')
                        }
                      >
                        Go to google calendar&nbsp;
                        <i className='far fa-calendar'></i>
                      </span>{' '}
                    </label>
                    <input
                      type='text'
                      className={validateCalendarId}
                      name='_calendarId'
                      placeholder='Your Public Google Calendar ID'
                      value={_calendarId}
                      onBlur={e =>
                        _calendarId === ''
                          ? setValidationClass({
                              ...validationClass,
                              validateCalendarId: 'form-control is-invalid'
                            })
                          : setValidationClass({
                              ...validationClass,
                              validateCalendarId: 'form-control'
                            })
                      }
                      onChange={e => onChange(e)}
                    />
                    <div className='invalid-feedback'>
                      Calendar ID is required
                    </div>
                  </span>
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
          <footer className='landing-footer'>&copy; 2020 Team DJK</footer>
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
