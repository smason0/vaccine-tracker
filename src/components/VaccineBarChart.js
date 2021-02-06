import * as React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { getBarColor } from '../helpers/colorHelpers';
import { getJurisdictionData, getManufacturerByDataKey } from '../helpers/dataHelpers';
import { dateFormatter, numberFormatter, shortenNumberDisplay } from '../helpers/formatHelpers';

import type { VaccineAllocationsT } from '../types/flowTypes';

type PropsT = {|
  vaccineAllocations: VaccineAllocationsT,
  jurisdiction?: string,
  combinedBars?: boolean,
|};

const VaccineBarChart = (props: PropsT): React.Node => {
  const { vaccineAllocations, jurisdiction, combinedBars } = props;

  const data = getJurisdictionData(vaccineAllocations, jurisdiction, combinedBars);
  const dataKeys = data.length ? Object.keys(data[0]).slice(1) : [];

  const bars = dataKeys.map((dataKey) => {
    const manufacturer = getManufacturerByDataKey(dataKey);

    return (
      <Bar
        dataKey={dataKey}
        key={manufacturer}
        fill={getBarColor(manufacturer)}
        name={manufacturer || 'Total'}
      />
    );
  });

  return (
    <BarChart
      width={600}
      height={400}
      data={data}
      margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid />
      <XAxis
        label={{ value: 'Week', offset: -10, position: 'insideBottom' }}
        dataKey="week"
        tickFormatter={dateFormatter}
        scale="band"
      />
      <YAxis
        label={{ value: 'Vaccines', angle: -90, offset: 0, position: 'insideLeft' }}
        tickFormatter={shortenNumberDisplay}
      />
      <Tooltip formatter={numberFormatter} labelFormatter={dateFormatter} />
      <Legend verticalAlign="top" />
      {bars}
    </BarChart>
  );
};

export default VaccineBarChart;
