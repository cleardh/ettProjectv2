import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IndNavbar from '../layouts/navbars/IndNavbar';
import member1 from '../../assets/img/avatar.png';
import member2 from '../../assets/img/avatar02.png';
import member3 from '../../assets/img/avatar03.png';
import advisor from '../../assets/img/avatar04.png';

const About = ({ auth: { user } }) => {
  return (
    <Fragment>
      <IndNavbar user={user} />
      <div className='about-wrapper'>
        <h2 className='heading-title'>Meet the Team</h2>
        <div className='grid-container'>
          <div className='grid-item profile'>
            <h4>Member 1</h4>
            <hr />
            <img src={member1} alt='team member 1' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Member 2</h4>
            <hr />
            <img src={member2} alt='team member 1' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Member 3</h4>
            <hr />
            <img src={member3} alt='team member 1' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Advisor</h4>
            <hr />
            <img src={advisor} alt='team member 1' />
            <p>Software Developer</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

About.propTypes = {
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(About);
