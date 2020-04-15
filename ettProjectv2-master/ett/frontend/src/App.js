import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import { loadUser } from './actions/auth';
import Landing from './components/authPages/Landing';
import Register from './components/authPages/Register';
import Auth from './components/authPages/Auth';
import Routes from './components/Routes';
import Alert from './components/layouts/Alert';

const App = () => {
  useEffect(() => {
    localStorage.token && store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Alert />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/auth' component={Auth} />
            <Route exact path='/register' component={Register} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
