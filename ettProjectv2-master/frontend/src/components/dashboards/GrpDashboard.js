import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  getAllOrganizations,
  getOrganizationByTitle
} from '../../actions/organization';
import { getAllCategories } from '../../actions/category';
import {
  getRequestsByOrg,
  confirmRequest,
  deleteRequest
} from '../../actions/request';
import Loading from '../layouts/Loading';
import GrpNavbar from '../layouts/navbars/GrpNavbar';
import OrgSelection from './OrgSelection';
import Chart from './Chart';

const GrpDashboard = ({
  auth: { user },
  org,
  category,
  request,
  getAllOrganizations,
  getOrganizationByTitle,
  getAllCategories,
  getRequestsByOrg,
  confirmRequest,
  deleteRequest
}) => {
  localStorage.setItem('component', 'GrpDashboard');

  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations]);

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    org.organization && getRequestsByOrg(org.organization._id);
  }, [getRequestsByOrg, org.organization]);

  const [title, setTitle] = useState('');

  const [parentStyle, setParentStyle] = useState({
    display: ''
  });
  const [childStyle, setChildStyle] = useState({
    display: ''
  });

  const [year, setYear] = useState(moment().year());

  const [cat, setCat] = useState('Vacation');

  const [categoryShow, setCategoryShow] = useState(false);

  const [yearShow, setYearShow] = useState(false);

  const selectYear = y => {
    setYear(y);
    setYearShow(!yearShow);
  };

  const selectCategory = c => {
    setCat(c);
    setCategoryShow(!categoryShow);
  };

  const showOrgSelect = e => {
    setParentStyle({ display: 'none' });
    setChildStyle({ display: '' });
  };

  useEffect(() => {
    title && getOrganizationByTitle(title);
  }, [getOrganizationByTitle, title]);

  if (user.role.title === 'Employee') {
    return <Redirect to='/dashboard/individual' />;
  }

  const confirm = request => {
    confirmRequest(request);
    getRequestsByOrg(org.organization._id);
  };

  const orgs = org.organizations.filter(o => o.head._id === user._id);

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

  return (
    <Fragment>
      <GrpNavbar user={user} />
      <div className='container org-selection' style={childStyle}>
        <OrgSelection
          orgs={orgs}
          title={t => setTitle(t)}
          parentStyle={s => setParentStyle(s)}
          childStyle={s => setChildStyle(s)}
        />
      </div>
      {org.organization ? (
        <Fragment>
          <div className='grid-container' style={parentStyle}>
            <div className='grid-item info-grid'>
              <div className='media'>
                <div className='media-body'>
                  <h4 className='mb-2 name-on-dashboard'>
                    {org.organization.title}
                  </h4>
                  <table className='tbl'>
                    <tbody>
                      <tr>
                        <td>
                          {org.organization.head.firstName +
                            ' ' +
                            org.organization.head.lastName}
                        </td>
                        <td rowSpan='2'>
                          <button
                            type='button'
                            className='btn btn-primary'
                            onClick={e => showOrgSelect(e)}
                          >
                            Select Organization
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>{org.organization.head.email}</td>
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
              {/* charts */}

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
                      requestDays={
                        request.requests.filter(
                          r =>
                            r.category._id === c._id &&
                            r.isConfirmed &&
                            moment(r.date).year() === year
                        ).length
                      }
                      org={org.organization}
                    />
                    {/* <div className='center-label'>
                    {c.isUnlimited
                      ? 'Unltd'
                      : `${getConfirmedRequestsByCategory(c._id)} / ${c.limit}`}
                  </div> */}
                  </div>
                ))}
              {/* End Chart */}
            </div>
            <div className='grid-item'>
              <ul className='list-group'>
                <li className='list-group-item active'>PENDING REQUESTS</li>
                <li className='list-group-item pendinglist'>
                  <table className='list-table'>
                    <tbody>
                      {request.requests
                        .filter(r => !r.isConfirmed)
                        .map(r => (
                          <tr key={r._id} className='lh-40'>
                            <td>{r.user.email}</td>
                            <td>
                              <span
                                className='badge badge-pill'
                                style={{
                                  background: `${r.category.color}`,
                                  color: '#fff'
                                }}
                              >
                                {r.category.title}
                              </span>
                            </td>
                            <td align='center'>
                              {moment(r.date)
                                .add(1, 'days')
                                .format('YYYY.MM.DD')}
                            </td>
                            <td align='right'>
                              <span
                                className='sm-btn'
                                onClick={e => confirm(r)}
                              >
                                <i className='fas fa-check-circle accept'></i>
                              </span>
                              <span
                                className='sm-btn'
                                onClick={e => deleteRequest(r)}
                              >
                                <i className='fas fa-times-circle decline'></i>
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
          </div>
        </Fragment>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

GrpDashboard.propTypes = {
  auth: PropTypes.object,
  org: PropTypes.object,
  category: PropTypes.object,
  request: PropTypes.object,
  getAllOrganizations: PropTypes.func.isRequired,
  getOrganizationByTitle: PropTypes.func.isRequired,
  getAllCategories: PropTypes.func.isRequired,
  getRequestsByOrg: PropTypes.func.isRequired,
  confirmRequest: PropTypes.func.isRequired,
  deleteRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  org: state.organization,
  category: state.category,
  request: state.request
});

export default connect(mapStateToProps, {
  getAllOrganizations,
  getOrganizationByTitle,
  getAllCategories,
  getRequestsByOrg,
  confirmRequest,
  deleteRequest
})(GrpDashboard);
