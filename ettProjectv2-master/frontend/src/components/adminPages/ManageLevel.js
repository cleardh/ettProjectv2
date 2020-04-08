import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import { getAllLevels, addLevel, deleteLevel } from '../../actions/level';
import Loading from '../layouts/Loading';

const ManageLevel = ({ level, getAllLevels, addLevel, deleteLevel }) => {
  localStorage.setItem('component', 'ManageLevel');
  useEffect(() => {
    getAllLevels();
  }, [getAllLevels, level.levels.length]);

  const [title, setTitle] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    displayDelete: 'none',
    selectedLevel: null,
  });
  const { displayDelete, selectedLevel } = showDeleteConfirm;

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = { title };
    addLevel(formData);
    setTitle('');
  };

  return (
    <Fragment>
      <AdmNavbar />
      {level.levels.length > 0 || !level.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'level'} />
          <div className='admin-wrapper'>
            <form className='admin-form' onSubmit={(e) => onSubmit(e)}>
              <fieldset>
                <legend>Manage Level</legend>
                <table className='table table-hover'>
                  <tbody>
                    {level.levels.map((l) => (
                      <Fragment key={l._id}>
                        <tr>
                          <td>
                            <em>{l.title}</em>
                          </td>
                          <td align='right'>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='delete'
                              onClick={(e) =>
                                setShowDeleteConfirm({
                                  displayDelete: 'block',
                                  selectedLevel: l,
                                })
                              }
                            >
                              <i className='far fa-trash-alt'></i>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>

                {/* Toast Confirm Delete */}
                {selectedLevel && (
                  <div
                    className='toast show admin-confirm'
                    role='alert'
                    aria-live='assertive'
                    aria-atomic='true'
                    style={{ display: displayDelete }}
                  >
                    <div className='toast-header'>
                      <strong className='mr-auto'>Confirm</strong>
                      <button
                        type='button'
                        className='ml-2 mb-1 close'
                        data-dismiss='toast'
                        aria-label='Close'
                        onClick={(e) =>
                          setShowDeleteConfirm({
                            displayDelete: 'none',
                            selectedLevel: null,
                          })
                        }
                      >
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                    <div className='toast-body'>
                      <div className='delete-msg'>
                        {`Do you really want to delele ${selectedLevel.title} level?`}
                      </div>
                      <div>
                        <button
                          type='button'
                          className='btn btn-danger btn-lg btn-block'
                          onClick={(e) => {
                            deleteLevel(selectedLevel._id);
                            setShowDeleteConfirm({
                              displayDelete: 'none',
                              selectedLevel: null,
                            });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Toast Confirm Delete */}

                <hr />
                <div className='form-group'>
                  <label htmlFor='title'>Title</label>
                  <input
                    type='text'
                    className='form-control'
                    name='title'
                    id='title'
                    placeholder='Enter title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </fieldset>
              <button type='submit' className='btn btn-primary block'>
                Save
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
};

ManageLevel.propTypes = {
  level: PropTypes.object,
  getAllLevels: PropTypes.func.isRequired,
  addLevel: PropTypes.func.isRequired,
  deleteLevel: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  level: state.level,
});

export default connect(mapStateToProps, {
  getAllLevels,
  addLevel,
  deleteLevel,
})(ManageLevel);
