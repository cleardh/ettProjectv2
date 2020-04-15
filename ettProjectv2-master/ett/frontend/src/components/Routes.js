import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Footer from './layouts/Footer';
import IndDashboard from './dashboards/IndDashboard';
import GrpDashboard from './dashboards/GrpDashboard';
import AdminMain from './adminPages/AdminMain';
import ManageEmployee from './adminPages/ManageEmployee';
import ManageRole from './adminPages/ManageRole';
import ManageJob from './adminPages/ManageJob';
import ManageCategory from './adminPages/ManageCategory';
import ManageOrg from './adminPages/ManageOrg';
import Report from './adminPages/Report';
import ManageLevel from './adminPages/ManageLevel';
import About from './aboutPage/About';
import { loadUser } from '../actions/auth';

const Routes = ({ auth: { token, user, isAuthenticated }, loadUser }) => {
  useEffect(() => {
    localStorage.token && loadUser();
  }, [loadUser]);

  if (!token || !localStorage.token || !user || !isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <Fragment>
      <Switch>
        <Route exact path='/dashboard/individual' component={IndDashboard} />
        <Route exact path='/dashboard/group' component={GrpDashboard} />
        <Route exact path='/admin/main' component={AdminMain} />
        <Route exact path='/admin/manage-role' component={ManageRole} />
        <Route exact path='/admin/manage-job' component={ManageJob} />
        <Route exact path='/admin/manage-employee' component={ManageEmployee} />
        <Route exact path='/admin/manage-category' component={ManageCategory} />
        <Route exact path='/admin/manage-level' component={ManageLevel} />
        <Route exact path='/admin/manage-organization' component={ManageOrg} />
        <Route exact path='/admin/report' component={Report} />
        <Route exact path='/about' component={About} />
      </Switch>
      <Footer />
    </Fragment>
  );
};

Routes.propTypes = {
  auth: PropTypes.object,
  loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser })(Routes);
