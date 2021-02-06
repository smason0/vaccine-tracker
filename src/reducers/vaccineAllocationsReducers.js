import type { LoadVaccineAllocationsActionT } from '../actions/loadVaccineAllocations';
import type { VaccineAllocationsReceivedActionT } from '../actions/vaccineAllocationsReceived';
import type { VaccineAllocationsErrorActionT } from '../actions/vaccineAllocationsError';

type StateT = {|
  +vaccineAllocations: {},
  +loading: boolean,
  +error: boolean,
|};

type ActionT = 
  | LoadVaccineAllocationsActionT
  | VaccineAllocationsReceivedActionT
  | VaccineAllocationsErrorActionT;

const initialState = {
  vaccineAllocations: {},
  loading: false,
  error: false,
};

const vaccineAllocationsReducer = (state: StateT = initialState, action: ActionT): StateT => {
  switch (action.type) {
    case 'LOAD_VACCINE_ALLOCATIONS':
      return {
        ...state,
        loading: true,
      };
    case 'VACCINE_ALLOCATIONS_RECEIVED':
      return {
        ...state,
        vaccineAllocations: action.vaccines,
        loading: false,
      };
    case 'VACCINE_ALLOCATIONS_ERROR':
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default vaccineAllocationsReducer;
