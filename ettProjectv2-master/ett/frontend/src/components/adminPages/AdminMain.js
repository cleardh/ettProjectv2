import React, { Fragment } from 'react';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';

const AdminMain = () => {
  localStorage.setItem('component', 'AdminMain');
  return (
    <Fragment>
      <AdmNavbar />
      <div className='wrapper'>
        <AdminSidebar current={'main'} />
        <div className='admin-wrapper'>
          <div className='card bg-custom mb-3 mw40'>
            <div className='card-header'>Welcome to Admin Page</div>
            <div className='card-body'>
              <h4 className='card-title'>As an admin, you can ...</h4>
              <p className='card-text'>add or remove roles,</p>
              <p className='card-text'>add or remove jobs,</p>
              <p className='card-text'>manage employees' information,</p>
              <p className='card-text'>add or remove categories,</p>
              <p className='card-text'>add or remove organization levels,</p>
              <p className='card-text'>add or remove organizations,</p>
              <p className='card-text'>generate reports.</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminMain;
