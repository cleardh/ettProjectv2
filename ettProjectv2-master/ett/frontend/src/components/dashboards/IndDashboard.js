import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import Loading from '../layouts/Loading';
import IndNavbar from '../layouts/navbars/IndNavbar';
import Calendar from './Calendar';
import Chart from './Chart';
import TimePicker from './ModalTimePicker';
import { getAllCategories, getCategoryByTitle } from '../../actions/category';
import {
  addRequest,
  deleteRequest,
  getRequestsByEmployee,
} from '../../actions/request';
import { getEmployeeByEmail } from '../../actions/employee';
import { setAlert } from '../../actions/alert';

const IndDashboard = ({
  history,
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
  setAlert,
}) => {
  localStorage.removeItem('component');

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  let email = null;
  if (history.location.state) {
    email = history.location.state.email;
  }

  useEffect(() => {
    getEmployeeByEmail(email ? email : user && user.email);
  }, [getEmployeeByEmail, email, user]);

  useEffect(() => {
    if (employee.employee) {
      getRequestsByEmployee(employee.employee._id);
    }
  }, [getRequestsByEmployee, employee.employee, request.requests.length]);

  const [formData, setFormData] = useState({
    _email: email ? email : '',
    _dateS: '',
    _dateE: '',
    _category: '',
  });
  const { _email, _dateS, _dateE, _category } = formData;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [dateValidity, setDateValidity] = useState(true);
  const [isSet, setIsSet] = useState(false);
  const [yearInCalendar, setYearInCalendar] = useState(moment().year());

  // Select date validation
  useEffect(() => {
    if (_dateS && _dateE && isSet) {
      if (
        moment(_dateS).tz('America/Toronto') >
        moment(_dateE).tz('America/Toronto')
      ) {
        setAlert('Start date must be before end date', 'danger');
        setDateValidity(false);
        setFormData({ ...formData, _dateS: '', _dateE: '' });
      } else if (
        moment(_dateS).tz('America/Toronto').format('YYYY-MM-DD') <
        moment().tz('America/Toronto').format('YYYY-MM-DD')
      ) {
        setAlert('Requested date is in the past', 'danger');
        setFormData({ ...formData, _dateS: '', _dateE: '' });
      } else {
        setDateValidity(true);
      }
    }
  }, [_dateS, _dateE, formData, isSet, selectedEvent, setAlert, dateValidity]);

  useEffect(() => {
    if (_category) {
      getCategoryByTitle(_category);
    }
  }, [getCategoryByTitle, _category]);

  const yearSelector = () => {
    let years = [];
    for (let i = 4; i >= 0; i--) {
      years.push(moment().subtract(i, 'years').year());
    }
    return years;
  };

  const [year, setYear] = useState(moment().year());

  const [cat, setCat] = useState({
    categoryTitle: 'Vacation',
    categoryColor: '#f47c3c',
  });
  const { categoryTitle, categoryColor } = cat;

  const selectYear = (y) => {
    setYear(y);
    setYearShow(!yearShow);
  };

  const selectCategory = (c) => {
    setCat({
      categoryTitle: c.title,
      categoryColor: c.color,
    });
    setCategoryShow(!categoryShow);
  };

  const totalRequestsByCategoryByYear = (requests, categoryId, year) => {
    const requestsByCategory = requests.filter(
      (r) => r.category._id === categoryId
    );

    let total = 0;

    const startAndEndInSameYear = requestsByCategory.filter(
      (r) =>
        moment(r.dateS).year() === moment().year(year).year() &&
        moment(r.dateE).year() === moment().year(year).year()
    );

    const startInLastYear = requestsByCategory.filter(
      (r) =>
        moment(r.dateS).year() !== moment().year(year).year() &&
        moment(r.dateE).year() === moment().year(year).year()
    );

    const EndInNextYear = requestsByCategory.filter(
      (r) =>
        moment(r.dateS).year() === moment().year(year).year() &&
        moment(r.dateE).year() !== moment().year(year).year()
    );

    startAndEndInSameYear.map((r) =>
      moment(r.dateE).diff(moment(r.dateS), 'days') !== 0
        ? (total += 1 + moment(r.dateE).diff(moment(r.dateS), 'days'))
        : moment(r.dateE).diff(moment(r.dateS), 'hours') > 5
        ? (total += 1)
        : (total += 0.5)
    );

    startInLastYear.map(
      (r) =>
        (total +=
          1 + moment(r.dateE).diff(moment().year(year).startOf('year'), 'days'))
    );

    EndInNextYear.map(
      (r) =>
        (total +=
          1 + moment().year(year).endOf('year').diff(moment(r.dateS), 'days'))
    );

    return total;
  };

  const getConfirmedRequestsByCategory = (categoryId) => {
    const confirmedRequests = request.requests.filter((r) => r.isConfirmed);
    return totalRequestsByCategoryByYear(confirmedRequests, categoryId, year);
  };

  const getRequestDaysAtStake = (startDate, endDate, year) => {
    let total = 0;
    const dateS = moment(startDate);
    const dateE = moment(endDate);

    if (
      dateS.year() === moment().year(year).year() &&
      dateE.year() === moment().year(year).year()
    ) {
      dateE.diff(dateS, 'days') !== 0
        ? (total += 1 + dateE.diff(dateS, 'days'))
        : dateE.diff(dateS, 'hours') > 5
        ? (total += 1 + dateE.diff(dateS, 'days'))
        : (total += 0.5);
    } else if (dateS.year() === moment().year(year).year()) {
      total += 1 + moment().year(year).endOf('year').diff(dateS, 'days');
    } else if (dateE.year() === moment().year(year).year()) {
      total += 1 + dateE.diff(moment().year(year).startOf('year'), 'days');
    }
    return total;
  };

  const addRequestOrWarn = () => {
    const existingEvents = request.requests.filter(
      (r) =>
        (moment(_dateS).tz('America/Toronto') <=
          moment(r.dateS).tz('America/Toronto') &&
          moment(_dateE).tz('America/Toronto') >=
            moment(r.dateE).tz('America/Toronto')) ||
        (moment(_dateS).tz('America/Toronto') <=
          moment(r.dateS).tz('America/Toronto') &&
          moment(_dateE).tz('America/Toronto') >=
            moment(r.dateS).tz('America/Toronto')) ||
        (moment(_dateS).tz('America/Toronto') <=
          moment(r.dateE).tz('America/Toronto') &&
          moment(_dateE).tz('America/Toronto') >=
            moment(r.dateE).tz('America/Toronto')) ||
        (moment(r.dateS).tz('America/Toronto') <=
          moment(_dateS).tz('America/Toronto') &&
          moment(r.dateE).tz('America/Toronto') >=
            moment(_dateE).tz('America/Toronto'))
    );

    if (
      !category.category.isUnlimited &&
      category.category.limit <
        totalRequestsByCategoryByYear(
          request.requests,
          category.category._id,
          yearInCalendar
        ) +
          getRequestDaysAtStake(_dateS, _dateE, yearInCalendar)
    ) {
      setAlert('Request denied due to limit', 'danger');
    } else if (existingEvents && existingEvents.length > 0) {
      setAlert('Request overlapping', 'danger');
    } else {
      addRequest(
        {
          email: _email,
          dateS: moment(_dateS)
            .tz('America/Toronto')
            .format(moment.HTML5_FMT.DATETIME_LOCAL),
          dateE: moment(_dateE)
            .tz('America/Toronto')
            .format(moment.HTML5_FMT.DATETIME_LOCAL),
          category: category.category,
        },
        employee.employee.calendarId
      );
    }

    setIsSet(false);
    setFormData({
      _email: '',
      _dateS: '',
      _dateE: '',
      _category: '',
    });
  };

  const deleteEvent = (event) => {
    if (
      moment(event.dateS).tz('America/Toronto').format('YYYY-MM-DD') <
      moment().tz('America/Toronto').format('YYYY-MM-DD')
    ) {
      setAlert('Old requests cannot be revoked', 'danger');
    } else {
      deleteRequest(event);
    }
    setSelectedEvent(null);
    setFormData({
      _email: '',
      _dateS: '',
      _dateE: '',
      _category: '',
    });
  };

  const [categoryShow, setCategoryShow] = useState(false);
  const [yearShow, setYearShow] = useState(false);
  const [eventList, setEventList] = useState(false);

  useEffect(() => {
    if (_dateS && request.requests) {
      const date = moment(_dateS).tz('America/Toronto').format('YYYY-MM-DD');
      const events = request.requests.filter(
        (r) =>
          moment(r.dateS).tz('America/Toronto').format('YYYY-MM-DD') <= date &&
          date <= moment(r.dateE).tz('America/Toronto').format('YYYY-MM-DD')
      );

      if (events.length > 0) {
        setSelectedEvent(events);
      } else {
        setSelectedEvent(null);
      }
    }
  }, [request.requests, _dateS]);

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
                      <td className='fw-500'>{employee.employee.job.title}</td>
                      <td className='fw-500'>{employee.employee.role.title}</td>
                    </tr>
                    <tr>
                      <td className='fw-500'>{employee.employee.email}</td>
                      <td className='fw-500'>{employee.employee.phone}</td>
                    </tr>
                    <tr>
                      <td className='fw-500'>{`Since ${moment(
                        employee.employee.dateHired
                      )
                        .tz('America/Toronto')
                        .add(1, 'days')
                        .format('MMMM DD, YYYY')}`}</td>
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
                  style={{
                    background: `${categoryColor}`,
                    borderColor: `${categoryColor}`,
                  }}
                  onClick={(e) => setCategoryShow(!categoryShow)}
                >
                  {categoryTitle}
                </button>
                <div
                  className='category-dropdown-menu dropdown-menu-bottom'
                  style={{ display: categoryShow ? '' : 'none' }}
                >
                  {category.categories.length > 0 &&
                    category.categories.map((c) => (
                      <button
                        key={c._id}
                        className='btn btn-secondary category-item'
                        type='button'
                        style={{
                          background: `${c.color}`,
                          borderColor: `${c.color}`,
                        }}
                        onClick={(e) => selectCategory(c)}
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
                  onClick={(e) => setYearShow(!yearShow)}
                >
                  {year}
                </button>
                <div
                  className='year-dropdown-menu dropdown-menu-right'
                  style={{ display: yearShow ? '' : 'none' }}
                >
                  {yearSelector().map((y) => (
                    <button
                      key={y}
                      type='button'
                      className='btn btn-secondary years'
                      onClick={(e) => selectYear(y)}
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
                  style={{ display: c.title === categoryTitle ? '' : 'none' }}
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
                    <TimePicker
                      startDate={
                        _dateS
                          ? moment(_dateS)
                              .tz('America/Toronto')
                              .format('YYYY-MM-DD')
                          : ''
                      }
                      endDate={
                        _dateE
                          ? moment(_dateE)
                              .tz('America/Toronto')
                              .format('YYYY-MM-DD')
                          : ''
                      }
                      isValid={dateValidity}
                      toggleShow={_dateS && _dateE ? true : false}
                      onOpen={(isOpen) => setOpacity(isOpen ? 0.5 : 1)}
                      onClose={(isClosed) => setOpacity(isClosed && 1)}
                      onCancel={(isCancelled) =>
                        isCancelled &&
                        setFormData({
                          ...formData,
                          _dateS: '',
                          _dateE: '',
                        })
                      }
                      setTime={(t) => {
                        t &&
                          t.start &&
                          t.end &&
                          setFormData({
                            ...formData,
                            _dateS: moment(_dateS + ' ' + t.start)
                              .tz('America/Toronto')
                              .format(moment.HTML5_FMT.D1ATETIME_LOCAL),
                            _dateE: moment(_dateE + ' ' + t.end)
                              .tz('America/Toronto')
                              .format(moment.HTML5_FMT.D1ATETIME_LOCAL),
                          });
                      }}
                      isSet={(isSet) => setIsSet(isSet)}
                    />
                    <div style={{ opacity }}>
                      <Calendar
                        data={(data) =>
                          _dateS && _dateE
                            ? setFormData({
                                ...formData,
                                _dateS: data,
                                _dateE: '',
                              })
                            : !_dateS
                            ? setFormData({
                                ...formData,
                                _dateS: data,
                              })
                            : setFormData({
                                ...formData,
                                _dateE: data,
                              })
                        }
                        events={request.requests}
                        setCalendarYear={(y) => setYearInCalendar(y)}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table className='calendar-table'>
                      <thead>
                        <tr>
                          <td colSpan={`${category.categories.length}`}>
                            <button
                              type='button'
                              className='btn btn-secondary btn-lg btn-block'
                              onClick={(e) => {
                                setFormData({
                                  _email: '',
                                  _dateS: '',
                                  _dateE: '',
                                  _category: '',
                                });
                                setSelectedEvent(null);
                                setIsSet(false);
                              }}
                              disabled={!_dateS && !_dateE && true}
                            >
                              Reset
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={`${category.categories.length}`}>
                            CHOOSE A CATEGORY
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {category.categories.length > 0 &&
                            category.categories.map((c) => (
                              <td key={c._id}>
                                <button
                                  type='button'
                                  className='btn btn-secondary category'
                                  style={{ background: c.color }}
                                  title={c.title}
                                  name='_category'
                                  data-tip
                                  data-for={c.title}
                                  value={_category}
                                  onClick={(e) =>
                                    setFormData({
                                      ...formData,
                                      _category: c.title,
                                      _email: employee.employee.email,
                                    })
                                  }
                                >
                                  <small className='category-title-nowrap'>
                                    {c.title}
                                  </small>
                                </button>
                                <ReactTooltip
                                  id={c.title}
                                  effect='solid'
                                  place='top'
                                  aria-haspopup='true'
                                >
                                  {c.title}
                                </ReactTooltip>
                              </td>
                            ))}
                        </tr>
                        <tr>
                          <td colSpan={`${category.categories.length}`}>
                            <button
                              type='button'
                              className='btn btn-primary btn-lg btn-block'
                              style={{ marginTop: '1em' }}
                              onClick={(e) => addRequestOrWarn()}
                              disabled={
                                _email && _dateS && _dateE && _category
                                  ? false
                                  : true
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
                              onClick={(e) => setEventList(true)}
                              disabled={!_dateS && true}
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
            <div
              className='toast show'
              role='alert'
              aria-live='assertive'
              aria-atomic='true'
              style={{ display: eventList ? 'block' : 'none' }}
            >
              <div className='toast-header'>
                <strong className='mr-auto'>Select Event to Revoke</strong>
                <button
                  type='button'
                  className='ml-2 mb-1 close'
                  data-dismiss='toast'
                  aria-label='Close'
                  onClick={(e) => {
                    setEventList(false);
                    setFormData({ ...formData, _dateS: '' });
                  }}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='toast-body'>
                {selectedEvent &&
                  selectedEvent.length > 0 &&
                  selectedEvent.map((ev) => (
                    <Fragment key={ev._id}>
                      <div>
                        <span
                          style={{
                            marginRight: '0.5em',
                            fontWeight: '600',
                            color: ev.category.color,
                          }}
                        >
                          {ev.category.title}
                        </span>
                        {`${moment(ev.dateS).format(
                          'YYYY-MM-DD HH:mm'
                        )}  ${moment(ev.dateE).format(
                          'YYYY-MM-DD HH:mm'
                        )}`}{' '}
                        <button
                          className='btn toast-trash'
                          onClick={(e) => {
                            deleteEvent(ev);
                            setEventList(false);
                          }}
                        >
                          <i className='far fa-trash-alt fa-2x'></i>
                        </button>
                      </div>
                    </Fragment>
                  ))}
              </div>
            </div>
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
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  category: state.category,
  employee: state.employee,
  request: state.request,
});

export default connect(mapStateToProps, {
  getAllCategories,
  getCategoryByTitle,
  addRequest,
  deleteRequest,
  getEmployeeByEmail,
  getRequestsByEmployee,
  setAlert,
})(IndDashboard);
