import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import Register from '../register/Register';
import Transfer from '../transfer/Transfer';

import WithdrawContainer from '../withdraw/WithdrawContainer';
import RegistryContainer from '../registry/RegistryContainer';

import {} from './stylesheets/app.scss';

const Home = ({ account, username }) => (
  <div>
    <Jumbotron className="app-jumbotron">
      <h1>GHRegistry</h1>
      <h2>A Github Identity Registry on Ethereum</h2>
      <p>
        Link your Github username with your Ethereum address
      </p>
      <div>
        <Register account={account} username={username}/>
        <Transfer account={account} username={username}/>
      </div>
    </Jumbotron>
    <RegistryContainer/>
  </div>
);

export default Home;
