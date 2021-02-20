import * as React from 'react';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { getBarColor } from '../helpers/colorHelpers';
import { getJurisdictionData, getManufacturerByDataKey } from '../helpers/dataHelpers';
import { dateFormatter, numberFormatter, shortenNumberDisplay } from '../helpers/formatHelpers';

import type { VaccineAllocationsT } from '../types/flowTypes';

const CHART_HEIGHT = 500;
const CHART_TOP_MARGIN = 10;
const CHART_RIGHT_MARGIN = 0;
const CHART_LEFT_MARGIN = 20;
const CHART_BOTTOM_MARGIN = 50;

type PropsT = {|
  vaccineAllocations: VaccineAllocationsT,
  jurisdiction?: string,
  combinedBars?: boolean,
  stackedBars?: boolean,
|};

const VaccineBarChart = (props: PropsT): React.Node => {
  const { vaccineAllocations, jurisdiction, combinedBars, stackedBars } = props;

  const data = getJurisdictionData(vaccineAllocations, jurisdiction, combinedBars);
  const dataKeys = data.length ? Object.keys(data[0]).slice(1) : [];

  const bars = dataKeys.map((dataKey) => {
    const manufacturer = getManufacturerByDataKey(dataKey);

    return (
      <Bar
        dataKey={dataKey}
        key={manufacturer}
        fill={getBarColor(manufacturer)}
        stackId={stackedBars ? 'x' : undefined}
        name={manufacturer || 'Total'}
      />
    );
  });

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <BarChart
        data={data}
        margin={
          { top: CHART_TOP_MARGIN, right: CHART_RIGHT_MARGIN, left: CHART_LEFT_MARGIN, bottom: CHART_BOTTOM_MARGIN }
        }
      >
        <CartesianGrid />
        <XAxis
          label={{ value: 'Week', offset: -CHART_BOTTOM_MARGIN, position: 'insideBottom' }}
          dataKey="week"
          tickFormatter={dateFormatter}
          minTickGap={0}
          angle={-45}
          textAnchor="end"
          scale="band"
        />
        <YAxis
          label={{ value: 'Vaccines distributed', angle: -90, offset: 0, position: 'insideLeft' }}
          tickFormatter={shortenNumberDisplay}
        />
        <Tooltip formatter={numberFormatter} labelFormatter={dateFormatter} />
        <Legend align="right" verticalAlign="top" layout="horizontal" wrapperStyle={{ paddingLeft: '10px' }} />
        {bars}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VaccineBarChart;
