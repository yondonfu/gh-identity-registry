import React from 'react';
import { connect } from 'react-redux';
import { fetchRegistry } from './actions/registry';

import Registry from './Registry';

class RegistryContainer extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchRegistry());
  }

  render() {
    const { pending, lastUpdated, entries } = this.props;

    return (
      <div>
        <Registry entries={entries}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { registry } = state;

  const {
    pending,
    lastUpdated,
    entries
  } = registry;

  return {
    pending,
    lastUpdated,
    entries
  };
}

export default connect(mapStateToProps)(RegistryContainer);
