import React, { Fragment } from 'react';
import DonutChart from 'react-google-charts';

const Chart = ({ category, requestDays }) => {
  const data = category.isUnlimited
    ? [
        ['Label', 'Days'],
        ['Remaining', 365]
      ]
    : [
        ['Label', 'Days'],
        ['Used', requestDays],
        ['Remaining', category.limit - requestDays]
      ];
  const options = {
    title: category.title,
    pieHole: 0.4,
    is3D: false,
    legend: { position: 'none' },
    colors: category.isUnlimited
      ? [category.color]
      : ['#8e8c84', category.color]
  };
  return (
    <Fragment>
      <DonutChart
        chartType='PieChart'
        width='280px'
        height='300px'
        data={data}
        options={options}
      />
    </Fragment>
  );
};

export default Chart;
