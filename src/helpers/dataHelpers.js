import { VaccineManufacturers } from '../constants/constants';
import type { VaccineAllocationsT } from '../types/flowTypes';

/**
 * Parses and retrieves the vaccines distributed from each vaccine manufacturer by jurisdiction.
 * Note: Assumption is made that the week keys match between manufacturers.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @param {string} jursdiction The jurisdiction for which to retrieve vaccine data.
 * @param {boolean} combinedBars Indicates if the manufacturer data should be combined into one bar. Defaults to false.
 * @returns {object[]} The array of object containing total vaccine distribution data.
 */
export const getJurisdictionData = (
  vaccineAllocations: VaccineAllocationsT,
  jurisdiction?: string,
  combinedBars: boolean = false,
): Array<any> => {
  let data = [];

  if (!Object.keys(vaccineAllocations).length) {
    return data;
  }
  
  const pfizerRow =
    vaccineAllocations.pfizer && vaccineAllocations.pfizer.find((row) => row.jurisdiction === jurisdiction);
  const modernaRow =
    vaccineAllocations.moderna && vaccineAllocations.moderna.find((row) => row.jurisdiction === jurisdiction);
  
  if (pfizerRow && modernaRow) {
    data = Object.keys(pfizerRow)
      .filter((key) => (key !== 'jurisdiction' && key !== 'total_first_doses'))
      .map((key) => (combinedBars ? {
        week: key,
        combinedVaccines: ((parseInt(pfizerRow[key]) || 0) + (parseInt(modernaRow[key]) || 0)),
      } : {
        week: key,
        pfizerVaccines: parseInt(pfizerRow[key]) || 0,
        modernaVaccines: parseInt(modernaRow[key]) || 0,
      }));
  }

  return data;
};

/**
 * Retrieves the total number of first vaccine doses by jurisdiction.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @param {string} jursdiction The jurisdiction for which to retrieve vaccine data.
 * @returns {string} The total first doses.
 */
export const getTotalFirstDoses = (vaccineAllocations: VaccineAllocationsT, jurisdiction: string): string => {
  let totalFirstDoses = 'N/A';
  
  if (!Object.keys(vaccineAllocations).length) {
    return totalFirstDoses;
  }
  
  const pfizerRow =
    vaccineAllocations.pfizer && vaccineAllocations.pfizer.find((row) => row.jurisdiction === jurisdiction);
  const modernaRow =
    vaccineAllocations.moderna && vaccineAllocations.moderna.find((row) => row.jurisdiction === jurisdiction);

  if (pfizerRow && modernaRow) {
    // total_first_doses is not valued for Total row of the response, must be manually calculated.
    if (jurisdiction === 'Total') {
      const { jurisdiction: _pj, total_first_doses: _pt, ...pfizerVaccinesByWeek } = pfizerRow;
      const { jurisdiction: _mj, total_first_doses: _mt, ...modernaVaccinesByWeek } = modernaRow;

      let totalSum = 0;
      let weeklyTotal;
      for (weeklyTotal of Object.values(pfizerVaccinesByWeek)) {
        totalSum += (parseInt(weeklyTotal) || 0);
      }
      for (weeklyTotal of Object.values(modernaVaccinesByWeek)) {
        totalSum += (parseInt(weeklyTotal) || 0);
      }

      totalFirstDoses = totalSum.toString();
    } else {
      totalFirstDoses = (
        (parseInt(pfizerRow.total_first_doses) || 0) + (parseInt(modernaRow.total_first_doses) || 0)
      ).toString();
    }
  }

  return totalFirstDoses;
};

/**
 * Retrieves the sorted list of jurisdictions.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @returns {string[]} The list of jurisdictions.
 */
export const getJurisdictionList = (vaccineAllocations: VaccineAllocationsT): Array<string> => {
  let jursdictions = [];
  
  if (!Object.keys(vaccineAllocations).length) {
    return jursdictions;
  }

  if (vaccineAllocations.pfizer) {
    jursdictions = vaccineAllocations.pfizer.map((row) => row.jurisdiction);
    jursdictions = jursdictions.sort().filter(item => item !== 'Total');
    jursdictions.unshift('Total');
  }

  return jursdictions;
};

/**
 * Retrieves the manufacturer based on the provided dataKey.
 * @param {string} dataKey The dataKey.
 * @returns {string} The manufacturer.
 */
export const getManufacturerByDataKey = (dataKey: string): ?$Values<typeof VaccineManufacturers> => {
  if (dataKey === 'pfizerVaccines') {
    return VaccineManufacturers.PFIZER;
  } else if (dataKey === 'modernaVaccines') {
    return VaccineManufacturers.MODERNA;
  }
  return null;
};