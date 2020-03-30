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
  getAllRequests,
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
  getAllRequests,
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
    getAllRequests();
  }, [getAllRequests]);

  const [title, setTitle] = useState('');

  const [parentStyle, setParentStyle] = useState({
    display: ''
  });
  const [childStyle, setChildStyle] = useState({
    display: ''
  });

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

  const orgs = org.organizations.filter(o => o.head._id === user._id);

  const getRequestsByOrg = o => {
    let totalRequestDays = 0;
    if (request.requests.length > 0) {
      o.members.map(m =>
        request.requests.map(
          r => r.user === m && r.isConfirmed && totalRequestDays++
        )
      );
    }
    return totalRequestDays;
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
            <div className='grid-item'>
              <div className='grid-container p-0'>
                {/* charts */}
                {category.categories.map((c, i) => (
                  <div key={c._id} className='grid-item'>
                    <div id={`chart${i + 1}`}>
                      <Chart
                        category={c}
                        requestDays={getRequestsByOrg(org.organization)}
                        org={org.organization}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='grid-item'>
              <ul className='list-group'>
                <li className='list-group-item active'>PENDING REQUESTS</li>
                <li className='list-group-item pendinglist'>
                  <table className='list-table'>
                    <tbody>
                      {org.organization.members.map(m =>
                        request.requests.map(
                          r =>
                            r.user._id === m._id &&
                            !r.isConfirmed && (
                              <tr className='lh-40'>
                                <td>{m.email}</td>
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
                                  {moment(r.date).format('YYYY.MM.DD')}
                                </td>
                                <td align='right'>
                                  <span
                                    className='sm-btn'
                                    onClick={e => confirmRequest(r._id)}
                                  >
                                    <i className='fas fa-check-circle accept'></i>
                                  </span>
                                  <span
                                    className='sm-btn'
                                    onClick={e =>
                                      deleteRequest(m.calendarId, r._id)
                                    }
                                  >
                                    <i className='fas fa-times-circle decline'></i>
                                  </span>
                                </td>
                              </tr>
                            )
                        )
                      )}
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
  getAllRequests: PropTypes.func.isRequired,
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
  getAllRequests,
  confirmRequest,
  deleteRequest
})(GrpDashboard);
