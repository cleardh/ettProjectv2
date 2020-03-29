import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Loading from '../layouts/Loading';
import IndNavbar from '../layouts/navbars/IndNavbar';
import Calendar from './Calendar';
import Chart from './Chart';
import { getAllCategories, getCategoryByTitle } from '../../actions/category';
import {
  addRequest,
  deleteRequest,
  getRequestsByEmployee
} from '../../actions/request';
import { getEmployeeByEmail } from '../../actions/employee';

const IndDashboard = ({
  email,
  auth: { user },
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
    _date: '',
    _category: ''
  });
  const { _email, _date, _category } = formData;

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

  useEffect(() => {
    if (_category) {
      getCategoryByTitle(_category);
    }
  }, [getCategoryByTitle, _category]);

  const getConfirmedRequestsByCategory = categoryId => {
    if (category.categories.length > 0 && request.requests.length > 0) {
      const c = category.categories.find(c => c._id === categoryId);
      const requestDays = request.requests.filter(
        r => r.category._id === c._id && r.isConfirmed
      );
      return requestDays.length;
    }
    return 0;
  };

  if (!employee.employee) {
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
                <h4 className='mb-2 name-on-dashboard'>{`${employee.employee.firstName} ${employee.employee.lastName}`}</h4>
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
          <div className='grid-item p-0'>
            <div className='grid-container p-0'>
              {/* Start Each Chart */}
              {category.categories.length > 0 &&
                category.categories.map((c, i) => (
                  <div className='grid-item donut-cell' key={i}>
                    <div id={`chart${i + 1}`}>
                      <Chart
                        category={c}
                        requestDays={getConfirmedRequestsByCategory(c._id)}
                      />
                      <div className='center-label'>
                        {c.isUnlimited
                          ? 'Unltd'
                          : `${getConfirmedRequestsByCategory(c._id)} / ${
                              c.limit
                            }`}
                      </div>
                    </div>
                  </div>
                ))}
              {/* End Each Chart */}
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
                      selectedEvent={e => {
                        setSelectedEvent(e);
                        console.log(e);
                      }}
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
                                  name='_category'
                                  value={_category}
                                  onClick={e =>
                                    setFormData({
                                      ...formData,
                                      _category: c.title,
                                      _email: employee.employee.email
                                    })
                                  }
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
                              onClick={e => {
                                _email &&
                                  category.category &&
                                  _date &&
                                  addRequest(
                                    {
                                      email: _email,
                                      date: moment(_date).format('YYYY-MM-DD'),
                                      category: category.category
                                    },
                                    employee.employee.calendarId
                                  );
                                setFormData({
                                  _email: '',
                                  _date: '',
                                  _category: ''
                                });
                              }}
                              disabled={
                                _email && _date && _category ? false : true
                              }
                            >
                              Request
                            </button>
                          </td>
                          <td colSpan='2'>
                            <button
                              type='button'
                              className='btn btn-secondary btn-lg btn-block'
                              onClick={e => {
                                deleteRequest(
                                  employee.employee.calendarId,
                                  selectedEvent._id
                                );
                                setFormData({
                                  _email: '',
                                  _date: '',
                                  _category: ''
                                });
                              }}
                              disabled={
                                !selectedEvent ||
                                (request.requests.filter(
                                  r => r.date === selectedEvent.date
                                ).length < 1 &&
                                  true)
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