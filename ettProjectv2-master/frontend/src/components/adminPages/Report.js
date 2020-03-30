import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminSidebar from './AdminSidebar';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import { generateReport } from '../../actions/request';

const Report = ({ generateReport }) => {
  localStorage.setItem('component', 'Report');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const { start, end } = dateRange;

  return (
    <Fragment>
      <AdmNavbar />
      <div className='wrapper'>
        <AdminSidebar current={'report'} />
        <div className='admin-wrapper'>
          <form
            className='admin-form'
            onSubmit={e => {
              e.preventDefault();
              generateReport(dateRange);
              setDateRange({ start: '', end: '' });
            }}
          >
            <fieldset>
              <legend>Generate Report</legend>
              <div className='form-group'>
                <label>Start Date</label>
                <input
                  type='date'
                  className='form-control'
                  value={start}
                  onChange={e =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div className='form-group'>
                <label>End Date</label>
                <input
                  type='date'
                  className='form-control'
                  value={end}
                  onChange={e =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
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

Report.propTypes = {
  generateReport: PropTypes.func.isRequired
};

export default connect(null, { generateReport })(Report);
