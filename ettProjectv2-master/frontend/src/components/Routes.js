import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
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

const Routes = () => {
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
      </Switch>
      <Footer />
    </Fragment>
  );
};

export default Routes;
