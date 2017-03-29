import React from 'react';

import {} from './stylesheets/about.scss';

const About = () => (
  <div className="about-container">
    <h1>About GHRegistry</h1>
    <p>
      GHRegistry is a decentralized registry linking Github usernames with Ethereum addresses. The GHRegistry contract is currently
      running on the Ethereum Ropsten Testnet.
    </p>
    <div>
      <h3>Motivation</h3>
      <p>
        I built this project to get some experience building an end-to-end full stack decentralized application, but also to create
        a proof-of-concept system that could allow developers to leverage off-chain identities when building their own applications.
      </p>
    </div>
    <div>
      <h3>Feedback & Issues</h3>
      <p>
        Check out the codebase and create issues on <a href="https://github.com/yondonfu/gh-identity-registry">Github</a>. Send any feedback
        to <a href="mailto:yondon.fu@gmail.com">yondon.fu@gmail.com</a>.
      </p>
    </div>
  </div>
);

export default About;
