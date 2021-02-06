export type LoadVaccineAllocationsActionT = {|
  type: 'LOAD_VACCINE_ALLOCATIONS',
|};

export const loadVaccineAllocations = (): LoadVaccineAllocationsActionT => ({
  type: 'LOAD_VACCINE_ALLOCATIONS',
});
