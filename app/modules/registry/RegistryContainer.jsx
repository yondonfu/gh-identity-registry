import React from 'react';
import { connect } from 'react-redux';
import { fetchRegistry } from './actions/registry';

import Registry from './Registry';

class RegistryContainer extends React.Component {
  componentDidMount() {
    this.props.loadRegistry();
  }

  render() {
    return (
      <Registry {...this.props}/>
    );
  }
}

const mapStateToProps = state => {
  const { registry } = state;

  const {
    pending,
    entries
  } = registry;

  return {
    pending,
    entries
  };
}

const mapDispatchToProps = dispatch => ({
  loadRegistry: () => {
    dispatch(fetchRegistry())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistryContainer);
