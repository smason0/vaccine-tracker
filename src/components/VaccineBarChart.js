import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { VaccineManufacturers } from '../constants/constants';
import { getBarColor } from '../helpers/colorHelpers';
import { getTotalData } from '../helpers/dataHelpers';
import { dateFormatter, numberFormatter, shortenNumberDisplay } from '../helpers/formatHelpers';

const VaccineBarChart = ({vaccineAllocations}) => {
  return (
    <BarChart
      width={600}
      height={400}
      data={getTotalData(vaccineAllocations)}
      margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid />
      <XAxis
        label={{ value: 'Week', offset: -10, position: 'insideBottom' }}
        dataKey="week"
        tickFormatter={dateFormatter}
      />
      <YAxis
        label={{ value: 'Vaccines', angle: -90, offset: 0, position: 'insideLeft' }}
        tickFormatter={shortenNumberDisplay}
      />
      <Tooltip formatter={numberFormatter} labelFormatter={dateFormatter} />
      <Legend verticalAlign="top" />
      <Bar
        dataKey="pfizerVaccines"
        fill={getBarColor(VaccineManufacturers.PFIZER)}
        name={VaccineManufacturers.PFIZER}
      />
      <Bar
        dataKey="modernaVaccines"
        fill={getBarColor(VaccineManufacturers.MODERNA)}
        name={VaccineManufacturers.MODERNA}
      />
    </BarChart>
  );
};

export default VaccineBarChart;
