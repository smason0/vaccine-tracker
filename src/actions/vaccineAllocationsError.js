export type VaccineAllocationsErrorActionT = {|
  type: 'VACCINE_ALLOCATIONS_ERROR',
|};

export const vaccineAllocationsError = (): VaccineAllocationsErrorActionT => ({
  type: 'VACCINE_ALLOCATIONS_ERROR',
});
