import { VaccineManufacturers } from '../constants/constants';
import type { VaccineAllocationsT } from '../types/flowTypes';

/**
 * Parses and retrieves the vaccines distributed from each vaccine manufacturer by jurisdiction.
 * Note: Assumption is made that the week keys match between manufacturers.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @param {string} jurisdiction The jurisdiction for which to retrieve vaccine data.
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

  const pfizerRows = getJurisdictionRows(vaccineAllocations.pfizer, jurisdiction);
  const modernaRows = getJurisdictionRows(vaccineAllocations.moderna, jurisdiction);
  const janssenRows = getJurisdictionRows(vaccineAllocations.janssen, jurisdiction);
  const weeks = getWeeks(vaccineAllocations);

  if (pfizerRows && modernaRows && janssenRows) {
    if (jurisdiction === 'Total') {
      data = weeks.map((week) => {
        return (combinedBars ? {
          week: week,
          combinedVaccines: getWeeklyTotalDoses(pfizerRows, week) +
                            getWeeklyTotalDoses(modernaRows, week) +
                            getWeeklyTotalDoses(janssenRows, week),
        } : {
          week: week,
          pfizerVaccines: getWeeklyTotalDoses(pfizerRows, week),
          modernaVaccines: getWeeklyTotalDoses(modernaRows, week),
          janssenVaccines: getWeeklyTotalDoses(janssenRows, week),
        });
      });
    } else {
      data = weeks.map((week) => {
        return (combinedBars ? {
          week: week,
          combinedVaccines: getWeeklyDoses(pfizerRows, week) +
                            getWeeklyDoses(modernaRows, week) +
                            getWeeklyDoses(janssenRows, week),
        } : {
          week: week,
          pfizerVaccines: getWeeklyDoses(pfizerRows, week),
          modernaVaccines: getWeeklyDoses(modernaRows, week),
          janssenVaccines: getWeeklyDoses(janssenRows, week),
        });
      });
    }
  }

  return data;
};

/**
 * Retrieves the total number of first vaccine doses by jurisdiction.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @param {string} jurisdiction The jurisdiction for which to retrieve vaccine data.
 * @returns {string} The total first doses.
 */
export const getTotalDosesAmount = (vaccineAllocations: VaccineAllocationsT, jurisdiction: string): string => {
  let totalFirstDoses = 0;
  
  if (!Object.keys(vaccineAllocations).length) {
    return 'N/A';
  }

  const pfizerRows = getJurisdictionRows(vaccineAllocations.pfizer, jurisdiction);
  const modernaRows = getJurisdictionRows(vaccineAllocations.moderna, jurisdiction);
  const janssenRows = getJurisdictionRows(vaccineAllocations.janssen, jurisdiction);
  const weeks = getWeeks(vaccineAllocations);

  if (pfizerRows && modernaRows && janssenRows) {
    weeks.forEach(week => {
      totalFirstDoses += (
        getWeeklyTotalDoses(pfizerRows, week) +
        getWeeklyTotalDoses(modernaRows, week) +
        getWeeklyTotalDoses(janssenRows, week)
      );
    });
  }
  
  return totalFirstDoses.toString();
};

/**
 * Retrieves the sorted list of jurisdictions.
 * @param {object} vaccineAllocations The vaccine allocations object to parse.
 * @returns {string[]} The list of jurisdictions.
 */
export const getJurisdictionList = (vaccineAllocations: VaccineAllocationsT): Array<string> => {
  let jurisdictions = [];
  
  if (!Object.keys(vaccineAllocations).length) {
    return jurisdictions;
  }

  if (vaccineAllocations.pfizer) {
    jurisdictions = [...new Set(vaccineAllocations.pfizer.map((row) => row.jurisdiction))].sort();
    jurisdictions.unshift('Total');
  }

  return jurisdictions;
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
  } else if (dataKey === 'janssenVaccines') {
    return VaccineManufacturers.JANSSEN;
  }
  return null;
};

const getJurisdictionRows = (vaccineAllocationsByManufacturer?: Array<any>, jurisdiction?: string): Array<Object> => {
  let rows = [];

  if (!vaccineAllocationsByManufacturer || !jurisdiction) {
    return rows;
  }
  
  if (jurisdiction === 'Total') {
    rows = vaccineAllocationsByManufacturer;
  } else {
    rows = vaccineAllocationsByManufacturer &&
           vaccineAllocationsByManufacturer.filter(row => row.jurisdiction === jurisdiction);
  }

  return rows.sort((row, nextRow) => ((row.week < nextRow.week) ? -1 : ((row.week > nextRow.week) ? 1 : 0)));
};

const getWeeks = (vaccineAllocations: VaccineAllocationsT): Array<string> => {
  const pfizerWeeks = vaccineAllocations.pfizer ?
    [...new Set(vaccineAllocations.pfizer.map((row) => row.week))] : [];
  const modernaWeeks = vaccineAllocations.moderna ?
    [...new Set(vaccineAllocations.moderna.map((row) => row.week))] : [];
  const janssenWeeks = vaccineAllocations.janssen ?
    [...new Set(vaccineAllocations.janssen.map((row) => row.week))] : [];

  return [...new Set([...pfizerWeeks, ...modernaWeeks, ...janssenWeeks])];
};

const getWeeklyDoses = (vaccineAllocationsByManufacturer?: Array<any>, week: string): number => {
  let doses = 0;

  if (!vaccineAllocationsByManufacturer) {
    return doses;
  }

  const dataRow = vaccineAllocationsByManufacturer.find((row) => row.week === week);

  if (dataRow && dataRow.doses) {
    doses = parseInt(dataRow.doses) || 0;
  }

  return doses;
};

const getWeeklyTotalDoses = (vaccineAllocationsByManufacturer?: Array<any>, week: string): number => {
  if (!vaccineAllocationsByManufacturer) {
    return 0;
  }

  function doses(row) {
    return (row.doses ? (parseInt(row.doses) || 0) : 0);
  }

  function sum(prev, next) {
    return prev + next;
  }

  const dataRowsForWeek = vaccineAllocationsByManufacturer.filter((row) => row.week === week);

  return dataRowsForWeek.length ? dataRowsForWeek.map(doses).reduce(sum) : 0;
};
