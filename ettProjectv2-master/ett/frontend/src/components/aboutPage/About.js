import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IndNavbar from '../layouts/navbars/IndNavbar';
import member1 from '../../assets/img/dkang.png';
import member2 from '../../assets/img/JordanWeadick.jpg';
import member3 from '../../assets/img/avatar03.png';
import advisor from '../../assets/img/avatar04.png';

const About = ({ auth: { user } }) => {
  localStorage.setItem('component', 'About');
  return (
    <Fragment>
      <IndNavbar user={user} isAbout={true} />
      <div className='about-wrapper'>
        <h2 className='heading-title'>Meet the Team</h2>
        <div className='grid-container'>
          <div className='grid-item profile'>
            <h4>Dongha Kang</h4>
            <hr />
            <img src={member1} alt='Dongha Kang' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Jordan Weadick</h4>
            <hr />
            <img src={member2} alt='Jordan Weadick' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Yasir Karapinar</h4>
            <hr />
            <img src={member3} alt='Yasir Karapinar' />
            <p>Software Developer</p>
          </div>
          <div className='grid-item profile'>
            <h4>Harry Scanlan (Advisor)</h4>
            <hr />
            <img src={advisor} alt='Advisor: Harry Scanlan' />
            <p>Software Developer</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

About.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(About);
