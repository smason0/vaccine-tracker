/* eslint-disable no-console */
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

  const pfizerRows = getJurisdictionRows(vaccineAllocations.pfizer, jurisdiction);
  const modernaRows = getJurisdictionRows(vaccineAllocations.moderna, jurisdiction);
  const janssenRows = getJurisdictionRows(vaccineAllocations.janssen, jurisdiction);

  function doses(row) {
    return (row.doses ? parseInt(row.doses) : 0);
  }

  function sum(prev, next) {
    return prev + next;
  }

  if (pfizerRows && modernaRows && janssenRows) {
    if (jurisdiction === 'Total') {
      const weeks = [...new Set(pfizerRows.map((row) => row.week))];
      data = weeks.map((week) => {
        const pfizerRowsForWeek = pfizerRows.filter((pfizerRow) => pfizerRow.week === week);
        const modernaRowsForWeek = modernaRows.filter((modernaRow) => modernaRow.week === week);
        const janssenRowsForWeek = janssenRows.filter((janssenRow) => janssenRow.week === week);

        const totalPfizerDoses = pfizerRowsForWeek.length ? pfizerRowsForWeek.map(doses).reduce(sum) : 0;
        const totalModernaDoses = modernaRowsForWeek.length ? modernaRowsForWeek.map(doses).reduce(sum) : 0;
        const totalJanssenDoses = janssenRowsForWeek.length ? janssenRowsForWeek.map(doses).reduce(sum) : 0;

        return (combinedBars ? {
          week: week,
          combinedVaccines: totalPfizerDoses + totalModernaDoses + totalJanssenDoses,
        } : {
          week: week,
          pfizerVaccines: totalPfizerDoses,
          modernaVaccines: totalModernaDoses,
          janssenVaccines: totalJanssenDoses,
        });
      });
    } else {
      data = pfizerRows.map((row) => {
        const modernaRow = modernaRows.find((modernaRow) => modernaRow.week === row.week);
        const janssenRow = janssenRows.find((janssenRow) => janssenRow.week === row.week);
        return (combinedBars ? {
          week: row.week,
          combinedVaccines: parseInt(row.doses) +
                            parseInt(modernaRow ? modernaRow.doses : 0) +
                            parseInt(janssenRow ? janssenRow.doses : 0),
        } : {
          week: row.week,
          pfizerVaccines: parseInt(row.doses),
          modernaVaccines: parseInt(modernaRow ? modernaRow.doses : 0),
          janssenVaccines: parseInt(janssenRow ? janssenRow.doses : 0),
        });
      });
    }
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
  let totalFirstDoses = 0;
  
  if (!Object.keys(vaccineAllocations).length) {
    return 'N/A';
  }

  const pfizerRows = getJurisdictionRows(vaccineAllocations.pfizer, jurisdiction);
  const modernaRows = getJurisdictionRows(vaccineAllocations.moderna, jurisdiction);
  const janssenRows = getJurisdictionRows(vaccineAllocations.janssen, jurisdiction);

  if (pfizerRows && modernaRows && janssenRows) {
    pfizerRows.forEach((row, index) => {
      totalFirstDoses += (
        parseInt(row.doses) +
        parseInt(modernaRows[index] ? modernaRows[index].doses : 0) +
        parseInt(janssenRows[index] ? janssenRows[index].doses : 0)
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

const getJurisdictionRows = (vaccineAllocationsByManufacturer: Array<Object>, jurisdiction: string): Array<Object> => {
  let rows = [];
  
  if (jurisdiction === 'Total') {
    rows = vaccineAllocationsByManufacturer;
  } else {
    rows = vaccineAllocationsByManufacturer &&
           vaccineAllocationsByManufacturer.filter(row => row.jurisdiction === jurisdiction);
  }

  return rows.sort((row, nextRow) => ((row.week < nextRow.week) ? -1 : ((row.week > nextRow.week) ? 1 : 0)));
};
