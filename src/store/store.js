import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import type { Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import vaccineAllocationsReducer from '../reducers/vaccineAllocationsReducers';
import loadVaccineAllocationsSagas from '../sagas/loadVaccineAllocationsSagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<any, any> = createStore(
  combineReducers({ vaccineAllocationsState: vaccineAllocationsReducer }),
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

export default store;

const sagas = [...loadVaccineAllocationsSagas];

sagas.map(saga => sagaMiddleware.run(saga));
