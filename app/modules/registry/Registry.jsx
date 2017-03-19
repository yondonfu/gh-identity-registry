import React from 'react';
import Table from 'react-bootstrap/lib/Table';

import {} from './stylesheets/registry.scss';

const Registry = ({ entries }) => (
  <Table striped bordered className="registry-table">
    <thead>
      <tr>
        <th>ETH Address</th>
        <th>Github Username</th>
      </tr>
    </thead>
    <tbody>
      {
        entries.map(({ ethAddress, username }) => (
          <tr key={ethAddress}>
            <td>{ethAddress}</td>
            <td>{username}</td>
          </tr>
        ))
      }
    </tbody>
  </Table>
);

export default Registry;
