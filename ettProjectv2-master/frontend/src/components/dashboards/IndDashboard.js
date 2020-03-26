import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import Loading from '../layouts/Loading';
import IndNavbar from '../layouts/navbars/IndNavbar';
import Calendar from './Calendar';
import { getAllCategories, getCategoryByTitle } from '../../actions/category';
import {
  addRequest,
  deleteRequest,
  getRequestsByEmployee
} from '../../actions/request';
import { getEmployeeByEmail } from '../../actions/employee';

const IndDashboard = ({
  email,
  auth: { token, user },
  category,
  employee,
  request,
  getAllCategories,
  getCategoryByTitle,
  addRequest,
  deleteRequest,
  getRequestsByEmployee,
  getEmployeeByEmail
}) => {
  const [formData, setFormData] = useState({
    _email: email ? email : '',
    _date: ''
  });
  const { _email, _date } = formData;

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    getEmployeeByEmail(email ? email : user && user.email);
  }, [getEmployeeByEmail, email, user]);

  useEffect(() => {
    if (employee.employee) {
      getRequestsByEmployee(employee.employee._id);
    }
  }, [getRequestsByEmployee, employee.employee, request.requests.length]);

  if (!token || !localStorage.token || !user) {
    return <Redirect to='/' />;
  } else if (!employee.employee) {
    return <Loading />;
  } else {
    return (
      <Fragment>
        <IndNavbar user={user} />
        <div className='grid-container'>
          <div className='grid-item info-grid'>
            <div className='media'>
              <img
                src={employee.employee.image}
                className='align-self-start mr-3'
                alt='employee'
              />
              <div className='media-body'>
                <h4 className='mb-2'>{`${employee.employee.firstName} ${employee.employee.lastName}`}</h4>
                <table className='tbl'>
                  <tbody>
                    <tr>
                      <td>{employee.employee.job.title}</td>
                      <td>{employee.employee.role.title}</td>
                    </tr>
                    <tr>
                      <td>{employee.employee.email}</td>
                      <td>{employee.employee.phone}</td>
                    </tr>
                    <tr>
                      <td>{`Since ${moment(employee.employee.dateHired).format(
                        'MMM DD, YYYY'
                      )}`}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='grid-item'>
            <div className='grid-container'>
              <div className='grid-item'>
                <div id='chart1'></div>
              </div>
              <div className='grid-item'>
                <div id='chart2'></div>
              </div>
              <div className='grid-item'>
                <div id='chart3'></div>
              </div>
              <div className='grid-item'>
                <div id='chart4'></div>
              </div>
            </div>
          </div>
          <div className='grid-item'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Calendar
                      data={data => setFormData({ ...formData, _date: data })}
                      events={request.requests}
                      selectedEvent={e => setSelectedEvent(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <table className='calendar-table'>
                      <thead>
                        <tr>
                          <th colSpan='4'>CHOOSE A CATEGORY</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {category.categories.length > 0 &&
                            category.categories.map(c => (
                              <td key={c._id}>
                                <button
                                  type='button'
                                  className='btn btn-secondary category'
                                  style={{ background: c.color }}
                                  data-toggle='tooltip'
                                  title={c.title}
                                  onClick={e => {
                                    setFormData({
                                      ...formData,
                                      _email: employee.employee.email
                                    });
                                    getCategoryByTitle(c.title);
                                  }}
                                >
                                  <small>{c.title}</small>
                                </button>
                              </td>
                            ))}
                        </tr>
                        <tr>
                          <td colSpan='2'>
                            <button
                              type='button'
                              className='btn btn-primary btn-lg btn-block'
                              onClick={e =>
                                _email &&
                                category.category &&
                                _date &&
                                addRequest(
                                  {
                                    email: _email,
                                    date: _date,
                                    category: category.category
                                  },
                                  employee.employee.calendarId
                                )
                              }
                            >
                              Request
                            </button>
                          </td>
                          <td colSpan='2'>
                            <button
                              type='button'
                              className='btn btn-secondary btn-lg btn-block'
                              onClick={e =>
                                selectedEvent &&
                                deleteRequest(
                                  employee.employee.calendarId,
                                  selectedEvent._id
                                )
                              }
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
};

IndDashboard.propTypes = {
  auth: PropTypes.object,
  category: PropTypes.object,
  employee: PropTypes.object,
  request: PropTypes.object,
  getAllCategories: PropTypes.func.isRequired,
  getCategoryByTitle: PropTypes.func.isRequired,
  addRequest: PropTypes.func.isRequired,
  deleteRequest: PropTypes.func.isRequired,
  getRequestsByEmployee: PropTypes.func.isRequired,
  getEmployeeByEmail: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  category: state.category,
  employee: state.employee,
  request: state.request
});

export default connect(mapStateToProps, {
  getAllCategories,
  getCategoryByTitle,
  addRequest,
  deleteRequest,
  getEmployeeByEmail,
  getRequestsByEmployee
})(IndDashboard);
