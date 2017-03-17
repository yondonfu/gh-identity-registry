import React from 'react';
import { connect } from 'react-redux';
import { fetchRegistry } from './actions/registry';

class RegistryContainer extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchRegistry());
  }

  render() {
    return (
      <div>
        foo
      </div>
    );
  }
}

const mapStateToProps = state => {
  const registry = state.registry;

  const {
    pending,
    lastUpdated,
    items
  } = registry;

  return {
    pending,
    lastUpdated,
    items
  };
}

export default connect(mapStateToProps)(RegistryContainer);
