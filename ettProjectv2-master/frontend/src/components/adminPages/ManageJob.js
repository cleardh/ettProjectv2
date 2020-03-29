import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import { getAllJobs, addJob, deleteJob } from '../../actions/job';

const ManageJob = ({ job, addJob, deleteJob, getAllJobs }) => {
  useEffect(() => {
    getAllJobs();
  }, [getAllJobs, job.jobs.length]);

  const [newJob, setNewJob] = useState({
    title: ''
  });
  const { title } = newJob;

  const onChange = e => setNewJob({ [e.target.name]: e.target.value });

  return (
    <Fragment>
      <AdmNavbar />
      {job.jobs.length > 0 || !job.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'job'} />
          <div className='admin-wrapper'>
            <form className='admin-form'>
              <fieldset>
                <legend>Manage Job</legend>
                <p></p>
                {job.jobs.map(j => (
                  <div key={j._id}>
                    <div className='input-group mb-3'>
                      <input
                        type='text'
                        className='form-control'
                        value={j.title}
                        readOnly
                      />
                      <div className='input-group-append'>
                        <button
                          className='btn btn-outline-secondary btn-admin'
                          type='button'
                          name={j.title}
                          onClick={e => deleteJob(j._id)}
                        >
                          <i className='far fa-trash-alt'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <hr />
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Add job'
                    name='title'
                    value={title}
                    onChange={e => onChange(e)}
                  />
                  <div className='input-group-append'>
                    <button
                      className='btn btn-outline-secondary btn-add'
                      type='button'
                      name='new_job'
                      onClick={e => {
                        addJob(newJob);
                        setNewJob({
                          title: ''
                        });
                      }}
                    >
                      <i className='fas fa-plus'></i>
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

ManageJob.propTypes = {
  job: PropTypes.object,
  addJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  getAllJobs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  job: state.job
});

export default connect(mapStateToProps, { addJob, getAllJobs, deleteJob })(
  ManageJob
);
