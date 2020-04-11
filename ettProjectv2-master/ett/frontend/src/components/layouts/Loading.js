import React, { Fragment } from 'react';

const Loading = () => {
  return (
    <Fragment>
      <div className='loading-wrapper'>
        <div className='circle-wrapper'>
          <div className='circle'></div>
          <div className='circle'></div>
          <div className='circle'></div>
          <div className='circle'></div>
          <div className='circle'></div>
        </div>
      </div>
      <footer className='landing-footer'>&copy; 2020 Team DJK</footer>;
    </Fragment>
  );
};

export default Loading;
