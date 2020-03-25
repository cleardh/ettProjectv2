import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import IndNavbar from '../layouts/navbars/IndNavbar';
import Calendar from './Calendar';
import { getAllCategories, getCategoryByTitle } from '../../actions/category';
import { addRequest } from '../../actions/request';

const IndDashboard = ({
  email,
  auth: { token, user },
  category,
  getAllCategories,
  getCategoryByTitle,
  addRequest
}) => {
  const [formData, setFormData] = useState({
    _email: email ? email : '',
    _date: ''
  });
  const { _email, _date } = formData;

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  if (!token || !localStorage.token) {
    return <Redirect to='/' />;
  } else if (!user) {
    return <Redirect to='/dashboard/individual' />;
  } else {
    return (
      <Fragment>
        <IndNavbar user={user} />
        <div className='grid-container'>
          <div className='grid-item info-grid'>
            <div className='media'>
              <img
                src={user.image}
                className='align-self-start mr-3'
                alt='employee'
              />
              <div className='media-body'>
                <h4 className='mb-2'>{`${user.firstName} ${user.lastName}`}</h4>
                <table className='tbl'>
                  <tbody>
                    <tr>
                      <td>{user.job.title}</td>
                      <td>{user.role.title}</td>
                    </tr>
                    <tr>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                    </tr>
                    <tr>
                      <td>{`Since ${moment(user.dateHired).format(
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
                              <td>
                                <button
                                  type='button'
                                  className='btn btn-danger category'
                                  onClick={e => {
                                    setFormData({
                                      ...formData,
                                      _email: user.email
                                    });
                                    getCategoryByTitle(c.title);
                                  }}
                                >
                                  <span>
                                    <small>{c.title}</small>
                                  </span>
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
                                addRequest({
                                  email: _email,
                                  date: _date,
                                  category: category.category
                                })
                              }
                            >
                              Request
                            </button>
                          </td>
                          <td colSpan='2'>
                            <button
                              type='button'
                              className='btn btn-secondary btn-lg btn-block'
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
  getAllCategories: PropTypes.func.isRequired,
  getCategoryByTitle: PropTypes.func.isRequired,
  addRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  category: state.category
});

export default connect(mapStateToProps, {
  getAllCategories,
  getCategoryByTitle,
  addRequest
})(IndDashboard);
