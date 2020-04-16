import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import { getAllRequests, deleteRequest } from '../../actions/request';
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
} from '../../actions/category';
import { setAlert } from '../../actions/alert';

const ManageCategory = ({
  category,
  request,
  deleteRequest,
  getAllRequests,
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
  setAlert,
}) => {
  localStorage.setItem('component', 'ManageCategory');

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories, category.categories]);

  useEffect(() => {
    getAllRequests();
  }, [getAllRequests]);

  const [btn, setBtn] = useState('add');
  const [colorPickerDisplay, setColorPickerDisplay] = useState('none');
  const [circlePickerValue, setCirclePickerValue] = useState('');
  const [newCategory, setNewCategory] = useState({
    title: '',
    limit: '',
    isUnlimited: false,
    color: '',
  });
  const { title, limit, isUnlimited, color } = newCategory;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    displayDelete: 'none',
    selectedCategory: null,
  });
  const { displayDelete, selectedCategory } = showDeleteConfirm;

  const onChange = (e) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  const setColorAndClose = (e) => {
    setNewCategory({
      ...newCategory,
      color: circlePickerValue,
    });
    setColorPickerDisplay('none');
  };

  const cancelColorPicker = (e) => {
    setCirclePickerValue('');
    setColorPickerDisplay('none');
    setNewCategory({
      ...newCategory,
      color: '',
    });
  };

  const loadCategory = (e, title) => {
    getCategoryByTitle(title);
    setBtn('edit');
  };

  useEffect(() => {
    if (btn === 'edit') {
      setNewCategory({
        title: category.category ? category.category.title : '',
        limit: category.category ? category.category.limit : '',
        isUnlimited: category.category ? category.category.isUnlimited : '',
        color: category.category ? category.category.color : '',
      });
    }
  }, [btn, category.category]);

  const addOrEdit = (e) => {
    if (btn === 'add') {
      if (category.categories.filter((c) => c.title === title).length > 0) {
        setAlert('Title already exists', 'danger');
      } else if (
        category.categories.filter((c) => c.color === color).length > 0
      ) {
        setAlert('Color already exists', 'danger');
      } else if (!isUnlimited && !limit) {
        setAlert('Please enter limit', 'danger');
      } else {
        addCategory(newCategory);
      }
    } else {
      if (
        category.categories.filter(
          (c) => c.title === title && title !== category.category.title
        ).length > 0
      ) {
        setAlert('Title already exists', 'danger');
      } else if (
        category.categories.filter(
          (c) => c.color === color && color !== category.category.color
        ).length > 0
      ) {
        setAlert('Color already exists', 'danger');
      } else if (!isUnlimited && !limit) {
        setAlert('Please enter limit', 'danger');
      } else {
        updateCategory(category.category._id, newCategory);
      }
    }

    setBtn('add');
    setNewCategory({
      title: '',
      limit: '',
      isUnlimited: false,
      color: '',
    });
    setCirclePickerValue('');
    setColorPickerDisplay('none');
  };

  const cancel = (e) => {
    setBtn('add');
    setNewCategory({
      title: '',
      limit: '',
      isUnlimited: false,
      color: '',
    });
    setCirclePickerValue('');
  };

  return (
    <Fragment>
      <AdmNavbar />
      {category.categories.length > 0 || !category.loading ? (
        <div className='wrapper'>
          <AdminSidebar current={'category'} />
          <div className='admin-wrapper'>
            <form className='admin-form'>
              <fieldset>
                <legend>Manage Category</legend>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'></th>
                      <th scope='col'>Max</th>
                      <th scope='col' className='text-center'>
                        Unlimited
                      </th>
                      <th scope='col' className='text-center'>
                        Color
                      </th>
                      <th scope='col'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.categories.map((c) => (
                      <Fragment key={c._id}>
                        <tr>
                          <th
                            scope='row'
                            className='org-link'
                            onClick={(e) => loadCategory(e, c.title)}
                          >
                            {c.title}
                          </th>
                          {c.isUnlimited ? (
                            <td>Unlimited</td>
                          ) : (
                            <td>{c.limit}</td>
                          )}
                          <td align='center'>
                            <div className='custom-control custom-switch'>
                              <input
                                type='checkbox'
                                className='custom-control-input'
                                id={c.title}
                                checked={c.isUnlimited ? true : false}
                                readOnly
                              />
                              <label
                                className='custom-control-label'
                                htmlFor={c.title}
                              ></label>
                            </div>
                          </td>
                          <td align='center'>
                            <div
                              className='color-code'
                              style={{ background: c.color }}
                            ></div>
                          </td>
                          <td align='right'>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='employee'
                              onClick={(e) =>
                                setShowDeleteConfirm({
                                  displayDelete: 'block',
                                  selectedCategory: c,
                                })
                              }
                            >
                              <i className='far fa-trash-alt'></i>
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                    <tr>
                      <td className='add-category'>
                        <div className='form-group'>
                          <input
                            type='text'
                            className='form-control category-input'
                            style={{ width: '8em' }}
                            placeholder='Category Title'
                            name='title'
                            value={title}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className='form-group'>
                          <input
                            type='number'
                            min='1'
                            className='form-control add-max category-input'
                            name='limit'
                            placeholder='Max'
                            value={limit}
                            onChange={(e) => onChange(e)}
                            disabled={isUnlimited}
                          />
                        </div>
                      </td>
                      <td align='center'>
                        <div className='custom-control custom-switch'>
                          <input
                            type='checkbox'
                            className='custom-control-input'
                            id='toggle'
                            name='isUnlimited'
                            checked={isUnlimited ? true : false}
                            onChange={(e) => {
                              setNewCategory({
                                ...newCategory,
                                isUnlimited: !isUnlimited,
                                limit: isUnlimited && '',
                              });
                            }}
                          />
                          <label
                            className='custom-control-label'
                            htmlFor='toggle'
                          ></label>
                        </div>
                      </td>
                      <td align='center'>
                        <div className='form-group'>
                          <div
                            className='color-code color-input'
                            style={{ background: color }}
                            onClick={(e) => setColorPickerDisplay('')}
                          ></div>
                        </div>
                      </td>
                      <td align='right'>
                        <button
                          className='btn btn-outline-secondary btn-add'
                          type='button'
                          name='new_role'
                          disabled={!title || !color ? true : false}
                          onClick={(e) => addOrEdit(e)}
                        >
                          {btn === 'add' ? (
                            <i className='fas fa-plus'></i>
                          ) : (
                            <i className='far fa-edit'></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* ColorPicker Popup */}
                <div style={{ display: colorPickerDisplay }}>
                  <div
                    className='modal'
                    style={{
                      position: 'absolute',
                      display: 'block',
                      top: '35%',
                      left: '0%',
                    }}
                  >
                    <div className='modal-dialog' role='document'>
                      <div className='modal-content'>
                        <div className='modal-header'>
                          <h5 className='modal-title modal-admin-title'>
                            Select Color
                          </h5>

                          <div className='form-group'>
                            <input
                              type='text'
                              className='form-control'
                              style={{
                                width: '8em',
                                textTransform: 'uppercase',
                              }}
                              id='inputDefault'
                              name='circlePickerValue'
                              value={circlePickerValue}
                              onChange={(e) =>
                                setCirclePickerValue(e.target.value)
                              }
                            />
                          </div>

                          <button
                            type='button'
                            className='close'
                            data-dismiss='modal'
                            aria-label='Close'
                            onClick={(e) => setColorPickerDisplay('none')}
                          >
                            <span aria-hidden='true'>&times;</span>
                          </button>
                        </div>
                        <div className='modal-body'>
                          <CirclePicker
                            width='450px'
                            colors={[
                              '#FF9AA2',
                              '#FFB7B2',
                              '#B5EAD7',
                              '#C7CEEA',
                              '#C36F31',
                              '#DDA982',
                              '#CAB39F',
                              '#FF9CEE',
                              '#85E3FF',
                            ]}
                            onChangeComplete={(c, e) =>
                              setCirclePickerValue(c.hex)
                            }
                          />
                        </div>
                        <div className='modal-footer'>
                          <button
                            type='button'
                            className='btn btn-primary'
                            onClick={(e) => setColorAndClose(e)}
                          >
                            Save changes
                          </button>
                          <button
                            type='button'
                            className='btn btn-secondary'
                            data-dismiss='modal'
                            onClick={(e) => cancelColorPicker(e)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ColorPicker Popup */}

                {/* Toast Confirm Delete */}
                {selectedCategory && (
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
                            selectedCategory: null,
                          })
                        }
                      >
                        <span aria-hidden='true'>&times;</span>
                      </button>
                    </div>
                    <div className='toast-body'>
                      <div className='delete-msg'>
                        {`Deleting ${selectedCategory.title} category requires deleting all requests of the category`}
                      </div>
                      <div>
                        <button
                          type='button'
                          className='btn btn-danger btn-lg btn-block'
                          onClick={(e) => {
                            deleteCategory(selectedCategory._id);
                            request.requests.map(
                              (r) =>
                                r.category._id === selectedCategory._id &&
                                deleteRequest(r)
                            );
                            setShowDeleteConfirm({
                              displayDelete: 'none',
                              selectedCategory: null,
                            });
                            setNewCategory({
                              title: '',
                              limit: '',
                              isUnlimited: false,
                              color: '',
                            });
                            setBtn('add');
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Toast Confirm Delete */}

                <button
                  type='button'
                  className='btn btn-danger block'
                  onClick={(e) => cancel(e)}
                  disabled={
                    title === '' && limit === '' && !isUnlimited && color === ''
                      ? true
                      : false
                  }
                >
                  Cancel
                </button>
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

ManageCategory.propTypes = {
  category: PropTypes.object,
  request: PropTypes.object,
  getAllRequests: PropTypes.func.isRequired,
  deleteRequest: PropTypes.func.isRequired,
  addCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  getAllCategories: PropTypes.func.isRequired,
  getCategoryByTitle: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  category: state.category,
  request: state.request,
});

export default connect(mapStateToProps, {
  getAllRequests,
  deleteRequest,
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
  setAlert,
})(ManageCategory);
