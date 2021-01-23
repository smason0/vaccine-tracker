import React from 'react';

import VaccineBarChart from './VaccineBarChart';

const VaccineView = ({vaccineAllocations}) => {
  return <VaccineBarChart vaccineAllocations={vaccineAllocations} />;
};

export default VaccineView;
