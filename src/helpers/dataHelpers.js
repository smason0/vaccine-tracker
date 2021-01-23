/**
 * Parses and retrieves the total vaccines distributed from each vaccine manufacturer.
 * Note: Assumption is made that the week keys match between manufacturers.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @param {boolean} combinedBar Indicates if the manufacturer data should be combined into one bar. Defaults to false.
 * @returns {object[]} The array of object containing total vaccine distribution data.
 */
export const getTotalData = (vaccineAllocations, combinedBar=false) => {
  if (!Object.keys(vaccineAllocations).length) {
    return [];
  }
  
  const totalPfizerRow =
    vaccineAllocations.pfizer && vaccineAllocations.pfizer.find((row) => row.jurisdiction === 'Total');
  const totalModernaRow =
    vaccineAllocations.moderna && vaccineAllocations.moderna.find((row) => row.jurisdiction === 'Total');

  const data = Object.keys(totalPfizerRow)
    .filter((key) => (key !== 'jurisdiction' && key !== 'total_first_doses'))
    .map((key) => (combinedBar ? {
      week: key,
      combinedVaccines: ((Number(totalPfizerRow[key]) || 0) + (Number(totalModernaRow[key]) || 0)).toString()
    } : {
      week: key,
      pfizerVaccines: totalPfizerRow[key],
      modernaVaccines: totalModernaRow[key]
    }));

  return data;
};
