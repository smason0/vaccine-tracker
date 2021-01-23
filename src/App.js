import React from 'react';
import { Provider } from 'react-redux';

import VaccineViewContainer from './containers/VaccineViewContainer';
import store from './store/store';

function App() {
  return (
    <Provider store={store} >
      <VaccineViewContainer />
    </Provider>
  );
}

export default App;
