import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import vaccineAllocationsReducer from '../reducers/vaccineAllocationsReducers';
import loadVaccineAllocationsSagas from '../sagas/loadVaccineAllocationsSagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ vaccineAllocationsState: vaccineAllocationsReducer }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

export default store;

const sagas = [...loadVaccineAllocationsSagas];

sagas.map(saga => sagaMiddleware.run(saga));
