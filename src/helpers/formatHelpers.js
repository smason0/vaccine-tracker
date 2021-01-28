import moment from 'moment';

/**
 * Formats the given date from YYYY-MM-DD format to MMM DD format.
 * @example '2021-01-14' becomes 'Jan 14'
 * @param {string} dateStr Date string to format.
 * @returns {string} The formatted date string.
 */
export const dateFormatter = dateStr => moment(dateStr, 'YYYY-MM-DD').format('MMM DD');

/**
 * Formats the given number by locale.
 * @param {number} num The number to format.
 * @returns {string} The formatted number string.
 */
export const numberFormatter = num => Number(num).toLocaleString();

/**
 * Shortens the given number and appends the corresponding suffix (k, m) if applicable.
 * @param {number} num The number to shorten.
 * @returns {string} The shortened number string.
 */
export const shortenNumberDisplay = (num) => {
  if (num > 1000000){
    return `${(num / 1000000).toString()}m`;
  } else if (num > 1000){
    return `${(num / 1000).toString()}k`;
  } else {
    return num.toString();
  }
};

/**
 * Formats the jurisdiction name from the vaccine JSON data to its display value.
 * @param {string} jurisdiction The jurisdiction.
 * @returns {string} The formatted jurisdiction display.
 */
export const getJurisdictionDisplay = (jurisdiction) => {
  let display = jurisdiction.trim();

  if (jurisdiction === 'Total') {
    display += ' (U.S.)';
  }

  return display;
};
