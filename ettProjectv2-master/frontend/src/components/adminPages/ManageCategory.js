import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AdmNavbar from '../layouts/navbars/AdmNavbar';
import AdminSidebar from './AdminSidebar';
import Loading from '../layouts/Loading';
import {
  addCategory,
  deleteCategory,
  getAllCategories
} from '../../actions/category';

const ManageCategory = ({
  history,
  user,
  category,
  addCategory,
  deleteCategory,
  getAllCategories
}) => {
  if (user && !user.role.isAdmin) {
    history.push('/dashboard/individual');
  }
  console.log('IN MANAGECATEGORY');

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories, category.categories.length]);

  const [newCategory, setNewCategory] = useState({
    title: '',
    limit: '',
    isUnlimited: false,
    color: ''
  });

  const { title, limit, isUnlimited, color } = newCategory;

  const onChange = e => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value
    });
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
                    {category.categories.map(c => (
                      <Fragment key={c._id}>
                        <tr>
                          <th scope='row'>{c.title}</th>
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
                            <span
                              class='badge badge-pill color-code'
                              style={{ background: c.color }}
                            >
                              {'  '}
                            </span>
                          </td>
                          <td>
                            <button
                              className='btn btn-outline-secondary btn-admin'
                              type='button'
                              name='employee'
                              onClick={e => deleteCategory(c._id)}
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
                            style={{ width: '6em' }}
                            placeholder='Category Title'
                            name='title'
                            value={title}
                            onChange={e => onChange(e)}
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
                            value={limit}
                            onChange={e => onChange(e)}
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
                            onChange={e => {
                              setNewCategory({
                                ...newCategory,
                                isUnlimited: !isUnlimited,
                                limit: isUnlimited && ''
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
                            type='text'
                            className='form-control category-input'
                            placeholder='#'
                            name='color'
                            value={color}
                            onChange={e => onChange(e)}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className='btn btn-outline-secondary btn-add'
                          type='button'
                          name='new_role'
                          onClick={e => {
                            addCategory(newCategory);
                            setNewCategory({
                              title: '',
                              limit: '',
                              isUnlimited: false
                            });
                          }}
                        >
                          <i className='fas fa-plus'></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button type='submit' className='btn btn-primary block'>
                  Save
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

const mapStateToProps = state => ({
  user: state.auth.user,
  category: state.category
});

export default connect(mapStateToProps, {
  addCategory,
  deleteCategory,
  getAllCategories
})(withRouter(ManageCategory));
