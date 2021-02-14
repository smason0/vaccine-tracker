import { call, put, takeLatest } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import axios from 'axios';

import { vaccineAllocationsReceived } from '../actions/vaccineAllocationsReceived';
import { vaccineAllocationsError } from '../actions/vaccineAllocationsError';

function getVaccineAllocations(): Promise<any> {
  const url = '/api/vaccines';

  return axios.get(url);
};

function* loadVaccineAllocations(_action): Saga<void> {
  try {
    const response = yield call(getVaccineAllocations);

    yield put(vaccineAllocationsReceived(response.data));
  } catch(error) {
    yield put(vaccineAllocationsError());
  }
}

function* loadVaccineAllocationsWatcher(): Saga<void> {
  yield takeLatest('LOAD_VACCINE_ALLOCATIONS', loadVaccineAllocations);
}

const loadVaccineAllocationsSagas = [loadVaccineAllocationsWatcher];

export default loadVaccineAllocationsSagas;
