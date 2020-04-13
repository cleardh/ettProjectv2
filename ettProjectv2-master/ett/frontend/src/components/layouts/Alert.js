import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
  const showAlert = () =>
    alerts && alerts.length > 0 ? (
      alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.msg}
        </div>
      ))
    ) : (
      <div></div>
    );

  return showAlert();
};

Alert.propTypes = {
  alerts: PropTypes.array,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
