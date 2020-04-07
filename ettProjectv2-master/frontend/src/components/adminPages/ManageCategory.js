import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
} from '../../actions/category';

const ManageCategory = ({
  category,
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
}) => {
  localStorage.setItem('component', 'ManageCategory');
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories, category.categories]);

  const [newCategory, setNewCategory] = useState({
    title: '',
    limit: '',
    isUnlimited: false,
    color: '',
  });

  const { title, limit, isUnlimited, color } = newCategory;

  const onChange = (e) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value,
    });
  };

  const [btn, setBtn] = useState('add');

  const [colorPickerDisplay, setColorPickerDisplay] = useState('none');

  const [circlePickerValue, setCirclePickerValue] = useState('');

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
    btn === 'add'
      ? addCategory(newCategory)
      : updateCategory(category.category._id, newCategory);

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
                      <th scope='col'>Unlimited</th>
                      <th scope='col'>Color Code</th>
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
                          <td>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='employee'
                              onClick={(e) => deleteCategory(c._id)}
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
                          <input
                            type='hidden'
                            className='form-control category-input'
                            name='color'
                            value={color}
                          />
                          <div
                            className='color-code color-input'
                            style={{ background: color }}
                            onClick={(e) => setColorPickerDisplay('')}
                          ></div>
                          <div style={{ display: colorPickerDisplay }}>
                            <div
                              className='modal'
                              style={{
                                position: 'absolute',
                                display: 'block',
                                top: '40%',
                              }}
                            >
                              <div className='modal-dialog' role='document'>
                                <div className='modal-content'>
                                  <div className='modal-header'>
                                    <h5 className='modal-title'>
                                      Select Color
                                    </h5>
                                    <div
                                      className='current-color'
                                      style={{
                                        borderColor:
                                          !circlePickerValue && 'transparent',
                                      }}
                                    >
                                      {circlePickerValue}
                                    </div>
                                    <button
                                      type='button'
                                      className='close'
                                      data-dismiss='modal'
                                      aria-label='Close'
                                      onClick={(e) =>
                                        setColorPickerDisplay('none')
                                      }
                                    >
                                      <span aria-hidden='true'>&times;</span>
                                    </button>
                                  </div>
                                  <div className='modal-body'>
                                    <CirclePicker
                                      width='450px'
                                      colors={[
                                        '#f44336',
                                        '#e91e63',
                                        '#9c27b0',
                                        '#673ab7',
                                        '#3f51b5',
                                        '#2196f3',
                                        '#03a9f4',
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
                        </div>
                      </td>
                      <td>
                        <button
                          className='btn btn-outline-secondary btn-add'
                          type='button'
                          name='new_role'
                          disabled={(!title || !color) && true}
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
                <button
                  type='button'
                  className='btn btn-danger block'
                  onClick={(e) => cancel(e)}
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
  addCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  getAllCategories: PropTypes.func.isRequired,
  getCategoryByTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  category: state.category,
});

export default connect(mapStateToProps, {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories,
  getCategoryByTitle,
})(ManageCategory);
