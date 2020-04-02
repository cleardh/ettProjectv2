import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
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
  deleteRequest,
  history
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
    display: 'none'
  });
  const [childStyle, setChildStyle] = useState({
    display: ''
  });

  const [year, setYear] = useState(moment().year());

  const [cat, setCat] = useState({
    categoryTitle: 'Vacation',
    categoryColor: '#f47c3c'
  });
  const { categoryTitle, categoryColor } = cat;

  const [categoryShow, setCategoryShow] = useState(false);

  const [yearShow, setYearShow] = useState(false);

  const selectYear = y => {
    setYear(y);
    setYearShow(!yearShow);
  };

  const selectCategory = c => {
    setCat({
      categoryTitle: c.title,
      categoryColor: c.color
    });
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
      {org.organization && (
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
                        <td className='fw-500'>
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
                        <td className='fw-500'>
                          {org.organization.head.email}
                        </td>
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
                      borderColor: `${categoryColor}`
                    }}
                    onClick={e => setCategoryShow(!categoryShow)}
                  >
                    {categoryTitle}
                  </button>
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
                          style={{
                            background: `${c.color}`,
                            borderColor: `${c.color}`
                          }}
                          onClick={e => selectCategory(c)}
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
                    {year}
                  </button>
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
                    style={{ display: c.title === categoryTitle ? '' : 'none' }}
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
              <ul className='list-group grp-listgroup'>
                <li className='list-group-item active'>PENDING REQUESTS</li>
                <li className='list-group-item pendinglist'>
                  <table className='list-table fw-500'>
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

              {/* All members */}
              <ul
                className='list-group grp-listgroup'
                style={{ marginTop: '1em' }}
              >
                <li className='list-group-item active'>ALL MEMBERS</li>
                {org.organization.members.map((m, i) => (
                  <li
                    key={m._id}
                    className='list-group-item fw-500 member-row'
                    onClick={e =>
                      history.push({
                        pathname: '/dashboard/individual',
                        state: { email: m.email }
                      })
                    }
                  >
                    <div key={m._id} className='lh-20'>
                      <span className='member-cell'>{i + 1}</span>
                      <span className='member-cell'>{m.email}</span>
                      <span
                        className='member-cell'
                        align='center'
                        style={{ width: '34%' }}
                      >
                        {m.firstName}
                      </span>
                      <span className='member-cell' align='right'>
                        {m.lastName}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Fragment>
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
})(withRouter(GrpDashboard));
