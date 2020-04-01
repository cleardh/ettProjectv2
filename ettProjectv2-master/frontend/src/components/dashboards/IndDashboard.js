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
import { setAlert } from '../../actions/alert';

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
  getEmployeeByEmail,
  setAlert
}) => {
  localStorage.removeItem('component');
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
        r =>
          r.category._id === c._id &&
          r.isConfirmed &&
          moment(r.date).year() === year
      );
      return requestDays.length;
    }
    return 0;
  };

  const deleteEvent = event => {
    deleteRequest(event);
    setFormData({
      _email: '',
      _date: '',
      _category: ''
    });
  };

  const yearSelector = () => {
    let years = [];
    for (let i = 4; i >= 0; i--) {
      years.push(
        moment()
          .subtract(i, 'years')
          .year()
      );
    }
    return years;
  };

  const [year, setYear] = useState(moment().year());

  const [cat, setCat] = useState('Vacation');

  const selectYear = y => {
    setYear(y);
    setYearShow(!yearShow);
  };

  const selectCategory = c_title => {
    setCat(c_title);
    setCategoryShow(!categoryShow);
  };

  const addRequestOrWarn = () => {
    const userRequestsByCategoryThisYear = request.requests.filter(
      r =>
        r.category._id === category.category._id &&
        r.user._id === user._id &&
        moment(r.date).year() === moment().year()
    ).length;
    if (
      category.category.isUnlimited ||
      category.category.limit > userRequestsByCategoryThisYear
    ) {
      addRequest(
        {
          email: _email,
          date: moment(_date).format('YYYY-MM-DD'),
          category: category.category
        },
        employee.employee.calendarId
      );
    } else {
      setAlert('Request denied due to limit', 'danger');
    }

    setFormData({
      _email: '',
      _date: '',
      _category: ''
    });
  };

  const [categoryShow, setCategoryShow] = useState(false);

  const [yearShow, setYearShow] = useState(false);

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
            <div className='chart-header'>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-secondary dropdown-toggle category-selector'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                  onClick={e => setCategoryShow(!categoryShow)}
                >
                  Category
                </button>
                <div className='category-label'>{cat}</div>
                <div
                  className='category-dropdown-menu dropdown-menu-bottom'
                  style={{ display: categoryShow ? '' : 'none' }}
                >
                  {category.categories.length > 0 &&
                    category.categories.map(c => (
                      <button
                        key={c._id}
                        className='btn btn-secondary category-item'
                        type='button'
                        onClick={e => selectCategory(c.title)}
                      >
                        {c.title}
                      </button>
                    ))}
                </div>
              </div>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-secondary dropdown-toggle year-selector'
                  data-toggle='dropdown'
                  aria-haspopup='true'
                  aria-expanded='false'
                  onClick={e => setYearShow(!yearShow)}
                >
                  Year
                </button>
                <div className='year-label'>{year}</div>
                <div
                  className='year-dropdown-menu dropdown-menu-right'
                  style={{ display: yearShow ? '' : 'none' }}
                >
                  {yearSelector().map(y => (
                    <button
                      key={y}
                      type='button'
                      className='btn btn-secondary years'
                      onClick={e => selectYear(y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Start Chart */}
            {category.categories.length > 0 &&
              category.categories.map((c, i) => (
                <div
                  key={i}
                  id={`chart${i + 1}`}
                  style={{ display: c.title === cat ? '' : 'none' }}
                >
                  <Chart
                    category={c}
                    requestDays={getConfirmedRequestsByCategory(c._id)}
                  />
                  <div className='center-label'>
                    {c.isUnlimited
                      ? 'Unltd'
                      : `${getConfirmedRequestsByCategory(c._id)} / ${c.limit}`}
                  </div>
                </div>
              ))}
            {/* End Chart */}
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
                                  <small className='category-title-nowrap'>
                                    {c.title}
                                  </small>
                                </button>
                              </td>
                            ))}
                        </tr>
                        <tr>
                          <td colSpan={`${category.categories.length}`}>
                            <button
                              type='button'
                              className='btn btn-primary btn-lg btn-block'
                              style={{ marginTop: '1em' }}
                              onClick={e => addRequestOrWarn()}
                              disabled={
                                _email && _date && _category ? false : true
                              }
                            >
                              Request
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={`${category.categories.length}`}>
                            <button
                              type='button'
                              className='btn btn-danger btn-lg btn-block'
                              onClick={e => deleteEvent(selectedEvent)}
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
  getEmployeeByEmail: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
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
  getRequestsByEmployee,
  setAlert
})(IndDashboard);
