import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TimePicker from 'react-time-picker';
import { setAlert } from '../../actions/alert';

const ModalTimePicker = ({
  startDate,
  endDate,
  isValid,
  toggleShow,
  onOpen,
  onClose,
  onCancel,
  startTimeSet,
  endTimeSet,
  isSet,
  setAlert,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [display, setDisplay] = useState(false);
  const [isAllday, setIsAllday] = useState(false);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    display ? onOpen(true) : onOpen(false);
  }, [display, onOpen]);

  useEffect(() => {
    setDisplay(toggleShow);
  }, [toggleShow, startDate, endDate]);

  useEffect(() => {
    startDate !== endDate ? setIsAllday(true) : setIsAllday(false);
  }, [startDate, endDate]);

  // Validation
  useEffect(() => {
    isValid ? setDisable(false) : setDisable(true);
  }, [isValid, setDisable]);

  useEffect(() => {
    if (isAllday) {
      setStartTime('00:00');
      setEndTime('23:59');
    } else {
      setStartTime('');
      setEndTime('');
    }
  }, [isAllday]);

  const exit = () => {
    onCancel(true);
    setStartTime('');
    setEndTime('');
    setDisplay(false);
    onClose(true);
  };

  return (
    <Fragment>
      <div
        className='modal'
        style={{
          display: display ? 'block' : 'none',
        }}
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <span className='modal-title'>Set Time</span>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={(e) => exit()}
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <table>
                <tbody>
                  <tr className='datetime-row'>
                    <th className='datetime-column'>Start Date: {startDate}</th>
                    <th className='datetime-column'>End Date: {endDate}</th>
                  </tr>
                  <tr className='datetime-row'>
                    <td>
                      <TimePicker
                        onChange={(t) => {
                          startTimeSet(t);
                          setStartTime(t);
                        }}
                        value={startTime}
                        disabled={isAllday}
                      />
                    </td>
                    <td>
                      <TimePicker
                        onChange={(t) => {
                          endTimeSet(t);
                          setEndTime(t);
                        }}
                        value={endTime}
                        disabled={isAllday}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='modal-footer'>
              {/* /////////////////////////////// */}
              <fieldset className='all-day-fieldset'>
                <div className='form-group all-day'>
                  <div className='custom-control custom-checkbox'>
                    <input
                      type='checkbox'
                      className='custom-control-input'
                      id='customCheck1'
                      name='isAllday'
                      checked={isAllday}
                      onChange={(e) => setIsAllday(!isAllday)}
                      disabled={startDate !== endDate && 'true'}
                    />
                    <label
                      className='custom-control-label'
                      htmlFor='customCheck1'
                    >
                      All day
                    </label>
                  </div>
                </div>
              </fieldset>
              {/* //////////////////////////// */}
              <button
                type='button'
                className='btn btn-primary'
                onClick={(e) => {
                  startTime && startDate && setStartTime(startTime);
                  endTime && endDate && setEndTime(endTime);
                  setDisplay(false);
                  onClose(true);
                  setIsAllday(false);
                  isSet(true);
                  if (startTime && endTime) {
                    setStartTime('');
                    setEndTime('');
                  }
                }}
                disabled={disable}
              >
                Set time
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ModalTimePicker.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(ModalTimePicker);
