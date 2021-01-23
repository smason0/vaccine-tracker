import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import VaccineView from '../components/VaccineView';

import { loadVaccineAllocations } from '../actions/loadVaccineAllocations';

const VaccineViewContainer = (props) => {
  const { error, loading, vaccineAllocations, loadVaccineAllocations } = props;

  useEffect(() => {
    loadVaccineAllocations();
  }, [loadVaccineAllocations]);

  let view = null;

  if (loading) {
    view = <h1>Loading...</h1>;
  } else if (error) {
    view = <h1>Error occurred</h1>;
  } else {
    view = <VaccineView vaccineAllocations={vaccineAllocations} />;
  };

  return view;
};

const mapStateToProps = (state) => ({
  vaccineAllocations: state.vaccineAllocationsState.vaccineAllocations,
  loading: state.vaccineAllocationsState.loading,
  error: state.vaccineAllocationsState.error,
});

const mapDispatchToProps = (dispatch) => ({
  loadVaccineAllocations: () => {
    dispatch(loadVaccineAllocations());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VaccineViewContainer);
