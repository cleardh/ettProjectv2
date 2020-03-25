import React, { Fragment } from 'react';
import AdminSidebar from './AdminSidebar';

const Report = () => {
  return (
    <Fragment>
      <div className='wrapper'>
        <AdminSidebar current={'report'} />
        <div className='admin-wrapper'>
          <form className='admin-form'>
            <fieldset>
              <legend>Generate Report</legend>
              <div className='form-group'>
                <label>Start Date</label>
                <input type='date' className='form-control' />
              </div>
              <div className='form-group'>
                <label>End Date</label>
                <input type='date' className='form-control' />
              </div>
              <button type='submit' className='btn btn-primary block'>
                Generate Report
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Report;
