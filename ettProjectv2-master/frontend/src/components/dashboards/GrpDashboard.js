import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAllOrganizations } from '../../actions/organization';
import GrpNavbar from '../layouts/navbars/GrpNavbar';

const GrpDashboard = ({ auth: { user }, org, getAllOrganizations }) => {
  useEffect(() => {
    getAllOrganizations();
  }, [getAllOrganizations]);

  const orgs = org.organizations.map(o => o.head._id === user._id);

  let dashboard = null;
  // if current user is not a head of a group
  if (org.organizations.length < 1) {
    dashboard = <div>You are not the head of an organization yet.</div>;
  } else if (org.organizations.length > 1) {
    dashboard = <div>Choose an organization from the list.</div>;
  } else {
    dashboard = (
      <div className='grid-container'>
        <div className='grid-item info-grid'>
          <div className='media'>
            <div className='media-body'>
              <h4 className='mb-2'>{org.organizations[0].title}</h4>
              <table className='tbl'>
                <tr>
                  <td>
                    {org.organizations[0].head.firstName +
                      ' ' +
                      org.organizations[0].head.lastName}
                  </td>
                </tr>
                <tr>
                  <td>{org.organizations[0].head.email}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className='grid-item'>
          <div className='grid-container'>
            {/* charts */}
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
          <ul className='list-group'>
            <li className='list-group-item active'>PENDING REQUESTS</li>
            <li className='list-group-item pendinglist'>
              <table className='list-table'>
                <tr>
                  <td>employee1@gmail.com</td>
                  <td>
                    <span className='badge badge-pill badge-info'>
                      Vacation
                    </span>
                  </td>
                  <td align='center'>2020.02.27</td>
                  <td align='right'>
                    <i className='fas fa-check-circle accept'></i>
                    <i className='fas fa-times-circle decline'></i>
                  </td>
                </tr>
              </table>
            </li>
            <li className='list-group-item pendinglist'>
              <table className='list-table'>
                <tr>
                  <td>employee2@gmail.com</td>
                  <td>
                    <span className='badge badge-pill badge-danger cell'>
                      Work from Home
                    </span>
                  </td>
                  <td align='center'>2020.02.28</td>
                  <td align='right'>
                    <i className='fas fa-check-circle accept'></i>
                    <i className='fas fa-times-circle decline'></i>
                  </td>
                </tr>
              </table>
            </li>
            <li className='list-group-item pendinglist'>
              <table className='list-table'>
                <tr>
                  <td>employee3@gmail.com</td>
                  <td>
                    <span className='badge badge-pill badge-warning cell'>
                      Birthday
                    </span>
                  </td>
                  <td align='center'>2020.03.03</td>
                  <td align='right'>
                    <i className='fas fa-check-circle accept'></i>
                    <i className='fas fa-times-circle decline'></i>
                  </td>
                </tr>
              </table>
            </li>
            <li className='list-group-item pendinglist'>
              <table className='list-table'>
                <tr>
                  <td>employee4@gmail.com</td>
                  <td>
                    <span className='badge badge-pill badge-success cell'>
                      Personal
                    </span>
                  </td>
                  <td align='center'>2020.03.04</td>
                  <td align='right'>
                    <i className='fas fa-check-circle accept'></i>
                    <i className='fas fa-times-circle decline'></i>
                  </td>
                </tr>
              </table>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (user.role.title === 'Employee') {
    return <Redirect to='/dashboard/individual' />;
  } else {
    return (
      <Fragment>
        <GrpNavbar user={user} />
        {dashboard}
      </Fragment>
    );
  }
};

GrpDashboard.propTypes = {
  auth: PropTypes.object,
  org: PropTypes.object,
  getAllOrganizations: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  org: state.organization
});

export default connect(mapStateToProps, { getAllOrganizations })(
  withRouter(GrpDashboard)
);
