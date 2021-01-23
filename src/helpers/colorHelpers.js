import { VaccineManufacturers, ChartColors } from '../constants/constants';

export const getBarColor = (manufacturer) => {
  switch(manufacturer) {
    case(VaccineManufacturers.PFIZER):
      return ChartColors.BLUE;
    case(VaccineManufacturers.MODERNA):
      return ChartColors.RED;
    default:
      return ChartColors.BLACK;
  }
};
