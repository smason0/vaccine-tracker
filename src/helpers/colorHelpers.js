import { VaccineManufacturers, ChartColors } from '../constants/constants';

/**
 * Takes in a manufacturer name (or null) and returns the corresponding chart color.
 * @param {string} manufacturer The manufacturer.
 * @returns {string} The chart color.
 */
export const getBarColor = (manufacturer: ?$Values<typeof VaccineManufacturers>): $Values<typeof ChartColors> => {
  switch(manufacturer) {
    case(VaccineManufacturers.PFIZER):
      return ChartColors.BLUE;
    case(VaccineManufacturers.MODERNA):
      return ChartColors.RED;
    case(VaccineManufacturers.JANSSEN):
      return ChartColors.PURPLE;
    default:
      return ChartColors.GREEN;
  }
};
