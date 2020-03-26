import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import { loadUser } from './actions/auth';
import Landing from './components/authPages/Landing';
import Register from './components/authPages/Register';
import Footer from './components/layouts/Footer';
import Auth from './components/authPages/Auth';
import IndDashboard from './components/dashboards/IndDashboard';
import GrpDashboard from './components/dashboards/GrpDashboard';
import AdminMain from './components/adminPages/AdminMain';
import ManageEmployee from './components/adminPages/ManageEmployee';
import ManageRole from './components/adminPages/ManageRole';
import ManageJob from './components/adminPages/ManageJob';
import ManageCategory from './components/adminPages/ManageCategory';
import ManageOrg from './components/adminPages/ManageOrg';
import Report from './components/adminPages/Report';
import ManageLevel from './components/adminPages/ManageLevel';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/auth' component={Auth} />
            <Route exact path='/register' component={Register} />
            <Route
              exact
              path='/dashboard/individual'
              component={IndDashboard}
            />
            <Route exact path='/dashboard/group' component={GrpDashboard} />
            <Route exact path='/admin/main' component={AdminMain} />
            <Route exact path='/admin/manage-role' component={ManageRole} />
            <Route exact path='/admin/manage-job' component={ManageJob} />
            <Route
              exact
              path='/admin/manage-employee'
              component={ManageEmployee}
            />
            <Route
              exact
              path='/admin/manage-category'
              component={ManageCategory}
            />
            <Route exact path='/admin/manage-level' component={ManageLevel} />
            <Route
              exact
              path='/admin/manage-organization'
              component={ManageOrg}
            />
            <Route exact path='/admin/report' component={Report} />
          </Switch>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
