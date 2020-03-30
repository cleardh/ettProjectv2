import React, { Fragment } from 'react';

const OrgSelection = ({ orgs, title, parentStyle, childStyle }) => {
  const setTitle = t => {
    title(t);
    parentStyle({
      display: ''
    });
    childStyle({
      display: 'none'
    });
  };

  return (
    <Fragment>
      <form className='admin-form'>
        <fieldset>
          <legend>Choose Organization</legend>
          <hr />
          {orgs.map(o => (
            <Fragment key={o._id}>
              <button
                type='button'
                className='btn btn-primary block'
                onClick={e => setTitle(o.title)}
              >
                {o.title}
              </button>
            </Fragment>
          ))}
        </fieldset>
      </form>
    </Fragment>
  );
};

export default OrgSelection;
