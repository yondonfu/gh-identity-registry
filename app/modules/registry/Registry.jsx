import React from 'react';

const Registry = ({ entries }) => (
  <table>
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
  </table>
);

export default Registry;
