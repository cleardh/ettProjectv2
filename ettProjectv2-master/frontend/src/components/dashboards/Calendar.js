import React, { Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';
import ReactTooltip from 'react-tooltip';
import '../../assets/css/calendar.css';

export default class Calendar extends React.Component {
  weekdayshort = moment.weekdaysShort();

  state = {
    showYearTable: false,
    showMonthTable: false,
    showDateTable: true,
    dateObject: moment().tz('America/Toronto'),
    allmonths: moment.tz('America/Toronto').months(),
    selectedDay: null,
    today: moment().tz('America/Toronto'),
    tooltip: 'none',
  };
  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format('Y');
  };
  currentDay = () => {
    return this.state.dateObject.format('MMMM DD, YYYY');
  };

  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject)
      .tz('America/Toronto')
      .startOf('month')
      .format('d'); // Day of week 0...1..5...6
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format('MMMM');
  };
  showMonth = (e, month) => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showDateTable: !this.state.showDateTable,
    });
  };
  setMonth = (month) => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).tz('America/Toronto').set('month', monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showDateTable: !this.state.showDateTable,
    });
  };
  MonthList = (props) => {
    let months = [];
    props.data.map((data) =>
      months.push(
        <td
          key={`${this.year()}${data}`}
          className='calendar-month'
          onClick={(e) => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      )
    );
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i === 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d, i) => {
      return <tr key={`${this.year()}${i}`}>{d}</tr>;
    });

    return (
      <table className='calendar-month'>
        <thead>
          <tr>
            <th colSpan='4'>Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };
  showYearTable = (e) => {
    this.setState({
      showYearTable: !this.state.showYearTable,
      showDateTable: !this.state.showDateTable,
    });
  };

  onPrev = () => {
    let curr = '';
    if (this.state.showYearTable === true) {
      curr = 'year';
    } else {
      curr = 'month';
    }
    this.setState({
      dateObject: this.state.dateObject.subtract(1, curr),
    });
  };
  onNext = () => {
    let curr = '';
    if (this.state.showYearTable === true) {
      curr = 'year';
    } else {
      curr = 'month';
    }
    this.setState({
      dateObject: this.state.dateObject.add(1, curr),
    });
  };
  setYear = (year) => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).tz('America/Toronto').set('year', year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearTable: !this.state.showYearTable,
    });
  };
  onYearChange = (e) => {
    this.setYear(e.target.value);
  };
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate).tz('America/Toronto');
    var _stopDate = moment(stopDate).tz('America/Toronto');
    while (currentDate <= _stopDate) {
      dateArray.push(moment(currentDate).tz('America/Toronto').format('YYYY'));
      currentDate = moment(currentDate).tz('America/Toronto').add(1, 'year');
    }
    return dateArray;
  }
  YearTable = (props) => {
    let months = [];
    let nextten = moment()
      .tz('America/Toronto')
      .set('year', props)
      .add(12, 'year')
      .format('Y');

    let tenyear = this.getDates(props, nextten);

    tenyear.map((data) =>
      months.push(
        <td
          key={data}
          className='calendar-month'
          onClick={(e) => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      )
    );
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i === 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      let yearKey = '';
      d.forEach((y) => {
        yearKey = y.key;
      });
      return <tr key={yearKey}>{d}</tr>;
    });

    return (
      <table className='calendar-month'>
        <thead>
          <tr>
            <th colSpan='4'>Select a Year</th>
          </tr>
        </thead>
        <tbody>{yearlist}</tbody>
      </table>
    );
  };
  onDayClick = (e, d) => {
    this.setState(
      {
        selectedDay: {
          year: this.year(),
          month: this.state.dateObject.format('MM'),
          date: d,
        },
      },
      () => {
        const data = moment(
          `${this.state.selectedDay.year}-${this.state.selectedDay.month}-${d}`
        )
          .tz('America/Toronto')
          .format('YYYY-MM-DD');
        this.props.data(data);

        console.log('SELECTED DAY: ', data);
      }
    );
  };
  render() {
    let weekdayshortname = this.weekdayshort.map((day) => {
      return <th key={`${this.year()}${this.month()}${day}`}>{day}</th>;
    });
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(
        <td key={i} className='calendar-day empty'>
          {''}
        </td>
      );
    }

    const eventList = this.props.events.filter(
      (e) =>
        (moment(e.dateS).tz('America/Toronto').format('Y') === this.year() &&
          moment(e.dateS).tz('America/Toronto').format('MMMM') ===
            this.month()) ||
        (moment(e.dateE).tz('America/Toronto').format('Y') === this.year() &&
          moment(e.dateE).tz('America/Toronto').format('MMMM') === this.month())
    );

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay =
        this.currentDay() === this.state.today.format('MMMM DD, YYYY') &&
        d === this.state.today.date()
          ? 'today'
          : '';

      const style = eventList.map(
        (e) =>
          moment(e.dateS).tz('America/Toronto').format('YYYY-MM-DD') <=
            moment(`${this.year()}-${this.month()}-${d}`)
              .tz('America/Toronto')
              .format('YYYY-MM-DD') &&
          moment(e.dateE).tz('America/Toronto').format('YYYY-MM-DD') >=
            moment(`${this.year()}-${this.month()}-${d}`)
              .tz('America/Toronto')
              .format('YYYY-MM-DD') &&
          (e.isConfirmed
            ? {
                background: `${e.category.color}`,
              }
            : {
                borderColor: `${e.category.color}`,
              })
      );

      const findEventsOnSelectedDay = (date) => {
        const events = this.props.events.filter(
          (e) =>
            moment(e.dateS).tz('America/Toronto').format('YYYY-MM-DD') <=
              moment(`${this.year()}-${this.month()}-${d}`)
                .tz('America/Toronto')
                .format('YYYY-MM-DD') &&
            moment(e.dateE).tz('America/Toronto').format('YYYY-MM-DD') >=
              moment(`${this.year()}-${this.month()}-${d}`)
                .tz('America/Toronto')
                .format('YYYY-MM-DD')
        );
        return events;
      };

      let styles = {
        background: '',
        borderColor: 'transparent',
      };

      style.map((s) => {
        if (s.background) {
          styles = {
            ...styles,
            background: s.background,
          };
        }
        if (s.borderColor) {
          styles = {
            ...styles,
            borderColor: s.borderColor,
          };
        }
        return styles;
      });

      daysInMonth.push(
        <Fragment key={d}>
          <td
            className='calendar-day'
            onClick={(e) => {
              this.onDayClick(e, d);
            }}
          >
            <div className='date' data-tip data-for={`tooltip${d}`}>
              {d}
            </div>
            <div
              className={`overlay-circle ${currentDay}`}
              style={styles}
            ></div>

            {findEventsOnSelectedDay(d).length > 0 && (
              <ReactTooltip
                id={`tooltip${d}`}
                effect='solid'
                place='top'
                aria-haspopup='true'
              >
                {findEventsOnSelectedDay(d).map((e) => (
                  <Fragment key={e._id}>
                    <div className='lh-sm'>
                      Start:{' '}
                      {moment(e.dateS)
                        .tz('America/Toronto')
                        .format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div className='lh-sm'>
                      End:{' '}
                      {moment(e.dateE)
                        .tz('America/Toronto')
                        .format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div className='lh-sm'>Category: {e.category.title}</div>
                    <div className='lh-sm'>
                      {e.isConfirmed ? 'Confirmed' : 'Pending'}
                    </div>
                  </Fragment>
                ))}
              </ReactTooltip>
            )}
          </td>
        </Fragment>
      );
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d) => {
      const key = uuidv4();
      if (d.length > 0) {
        return (
          <tr key={key} className='date-row'>
            {d}
          </tr>
        );
      } else {
        return <tr key={key}></tr>;
      }
    });

    return (
      <div className='tail-datetime-calendar'>
        <div className='calendar-navi'>
          <span
            onClick={(e) => {
              this.onPrev();
            }}
            className='calendar-button button-prev'
          />
          {!this.state.showMonthTable && (
            <span
              onClick={(e) => {
                this.showMonth();
              }}
              className='calendar-label'
            >
              {this.month()}
            </span>
          )}
          <span
            className='calendar-label'
            onClick={(e) => this.showYearTable()}
          >
            {this.year()}
          </span>
          <span
            onClick={(e) => {
              this.onNext();
            }}
            className='calendar-button button-next'
          />
        </div>

        <div className='calendar-date'>
          {this.state.showYearTable && <this.YearTable props={this.year()} />}
          {this.state.showMonthTable && (
            <this.MonthList data={moment.months()} />
          )}
        </div>

        {this.state.showDateTable && (
          <div className='calendar-date'>
            <table className='calendar-day'>
              <thead>
                <tr>{weekdayshortname}</tr>
              </thead>
              <tbody>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
