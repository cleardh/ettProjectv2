import React from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import '../../assets/css/calendar.css';

export default class Calendar extends React.Component {
  weekdayshort = moment.weekdaysShort();

  state = {
    showYearTable: false,
    showMonthTable: false,
    showDateTable: true,
    dateObject: moment(),
    allmonths: moment.months(),
    selectedDay: null,
    today: moment()
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
      showDateTable: !this.state.showDateTable
    });
  };
  setMonth = month => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('month', monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showDateTable: !this.state.showDateTable
    });
  };
  MonthList = props => {
    let months = [];
    props.data.map(data =>
      months.push(
        <td
          key={`${this.year()}${data}`}
          className='calendar-month'
          onClick={e => {
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
  showYearTable = e => {
    this.setState({
      showYearTable: !this.state.showYearTable,
      showDateTable: !this.state.showDateTable
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
      dateObject: this.state.dateObject.subtract(1, curr)
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
      dateObject: this.state.dateObject.add(1, curr)
    });
  };
  setYear = year => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set('year', year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearTable: !this.state.showYearTable
    });
  };
  onYearChange = e => {
    this.setYear(e.target.value);
  };
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var _stopDate = moment(stopDate);
    while (currentDate <= _stopDate) {
      dateArray.push(moment(currentDate).format('YYYY'));
      currentDate = moment(currentDate).add(1, 'year');
    }
    return dateArray;
  }
  YearTable = props => {
    let months = [];
    let nextten = moment()
      .set('year', props)
      .add(12, 'year')
      .format('Y');

    let tenyear = this.getDates(props, nextten);

    tenyear.map(data =>
      months.push(
        <td
          key={data}
          className='calendar-month'
          onClick={e => {
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
      d.forEach(y => {
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
          date: d
        }
      },
      () => {
        console.log(
          'SELECTED DAY: ',
          moment(
            `${this.state.selectedDay.year}-${this.state.selectedDay.month}-${d}`
          ).format('YYYY-MM-DD')
        );
        const data = moment(
          `${this.state.selectedDay.year}-${this.state.selectedDay.month}-${d}`
        ).format('YYYY-MM-DD');
        this.props.data(data);

        const eventList = this.props.events.filter(
          e =>
            moment(e.date)
              .add(1, 'days')
              .format('Y') === this.year() &&
            moment(e.date)
              .add(1, 'days')
              .format('MMMM') === this.month()
        );

        eventList.map(
          e =>
            moment(e.date)
              .add(1, 'days')
              .date() === d && this.props.selectedEvent(e)
        );
      }
    );
  };
  render() {
    let weekdayshortname = this.weekdayshort.map(day => {
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
    let daysInMonth = [];

    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay =
        this.currentDay() === this.state.today.format('MMMM DD, YYYY') &&
        d === this.state.today.date()
          ? 'today'
          : '';
      const eventList = this.props.events.filter(
        e =>
          moment(e.date)
            .add(1, 'days')
            .format('Y') === this.year() &&
          moment(e.date)
            .add(1, 'days')
            .format('MMMM') === this.month()
      );
      const style = eventList.map(
        e =>
          moment(e.date)
            .add(1, 'days')
            .date() === d &&
          (e.isConfirmed
            ? {
                background: `${e.category.color}`
              }
            : {
                color: `${e.category.color}`,
                textDecoration: 'underline',
                fontWeight: '600'
              })
      );

      let styles = {
        background: '',
        borderRadius: 40,
        WebkitBorderRadius: 40
      };
      style.map(s => {
        if (s.background) {
          styles = {
            ...styles,
            background: s.background
          };
        }
        if (s.color && s.textDecoration && s.fontWeight) {
          styles = {
            ...styles,
            color: s.color,
            textDecoration: s.textDecoration,
            fontWeight: s.fontWeight
          };
        }
        return styles;
      });

      daysInMonth.push(
        <td
          key={d}
          className={`calendar-day ${currentDay}`}
          style={styles}
          onClick={e => {
            this.onDayClick(e, d);
          }}
        >
          {d}
        </td>
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

    let daysinmonth = rows.map(d => {
      return <tr key={uuidv4()}>{d}</tr>;
    });

    return (
      <div className='tail-datetime-calendar'>
        <div className='calendar-navi'>
          {/* <span
            onClick={e => {
              this.onPrev();
            }}
            className='calendar-button button-prev'
          /> */}
          {!this.state.showMonthTable && (
            <span
              onClick={e => {
                this.showMonth();
              }}
              className='calendar-label'
            >
              {this.month()}
            </span>
          )}
          <span className='calendar-label' onClick={e => this.showYearTable()}>
            {this.year()}
          </span>
          {/* <span
            onClick={e => {
              this.onNext();
            }}
            className='calendar-button button-next'
          /> */}
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
