import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function getVaccineAllocations() {
  const url = '/vaccines';

  return axios.get(url);
};

function* loadVaccineAllocations(_action) {
  try {
    const response = yield call(getVaccineAllocations);

    yield put({ type: 'VACCINE_ALLOCATIONS_RECIEVED', vaccines: response.data });
  } catch(error) {
    yield put({ type: 'VACCINE_ALLOCATIONS_ERROR' });
  }
}

function* loadVaccineAllocationsWatcher() {
  yield takeLatest('LOAD_VACCINE_ALLOCATIONS', loadVaccineAllocations);
}

const loadVaccineAllocationsSagas = [loadVaccineAllocationsWatcher];

export default loadVaccineAllocationsSagas;
