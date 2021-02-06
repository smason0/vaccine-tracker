import type { VaccineAllocationsT } from '../types/flowTypes';

export type VaccineAllocationsReceivedActionT = {|
  type: 'VACCINE_ALLOCATIONS_RECEIVED', vaccines: VaccineAllocationsT,
|};

export const vaccineAllocationsReceived = (vaccines: VaccineAllocationsT): VaccineAllocationsReceivedActionT => ({
  type: 'VACCINE_ALLOCATIONS_RECEIVED', vaccines,
});
