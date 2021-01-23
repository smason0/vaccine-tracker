const initialState = {
  vaccineAllocations: {},
  loading: false,
  error: false,
};

const vaccineAllocationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_VACCINE_ALLOCATIONS':
      return {
        ...state,
        loading: true,
      };
    case 'VACCINE_ALLOCATIONS_RECIEVED':
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
