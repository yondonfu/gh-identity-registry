# Github Identity Registry

Decentralized registry linking Ethereum addresses with Github usernames. This was a learning project and a first run at a full-stack Ethereum DApp. The smart contract was built and tested using Truffle, Solidity and TestRPC. The frontend was built using using React/Redux and Webpack.

The GHRegistry contract is deployed on Ropsten testnet: https://ropsten.etherscan.io/address/0xbeff59ebbb5b2dea061dffd5873806d96a03f978

# Running locally

You will require Node v6.5.0 or higher installed.

If you do not have Truffle installed:

`npm install -g truffle`

```
git clone https://github.com/yondonfu/gh-identity-registry.git
cd gh-identity-registry
npm install
npm run dev // Starts webpack-dev-server
```

Access the locally running app at `http://localhost:8080/`.

You will need to be running a local Ethereum node by using a client like [Geth](https://github.com/ethereum/go-ethereum) or be using an Ethereum browser plugin like [Metamask](https://metamask.io/). Make sure you are using the Ropsten testnet.

If you want to use [TestRPC](https://github.com/ethereumjs/testrpc) you will need to use Oraclize's [ethereum-bridge](https://github.com/oraclize/ethereum-bridge) tool.

You can also interact with the on-chain contract with the Truffle console to check for your Github username. Make sure to have a Geth node running on the Ropsten testnet on `localhost:8545`.

```
cd gh-identity-registry
truffle console --network ropsten

GHRegistry.deployed().then(function(instance) {
  instance.registry.call(<eth-address>).then(console.log);
});
```

# Protocol

`GHRegistry.sol` is the smart contract that maintains the state of the registry. The contract allows users to:

- Verify a Github username and link it with an Ethereum address
- Transfer a Github username linked with an Ethereum address to another Ethereum address

In order to verify that a user owns a Github username, the user must create a gist file on Github with the following format:

```
<eth-address>
```

The user provides the raw content gist url (click on the `Raw` button for the gist file) to the contract as proof.

Example raw gist url: https://gist.githubusercontent.com/yondonfu/20711bc7b0241425b73c12253fda12e5/raw/9fc1f8d6dd43536cc801b585f0203ff8221d9d5d/gistfile1.txt

The contract uses [Oraclize](http://www.oraclize.it/) to access and parse the contents of the provided raw content gist url.

The user also provides a deposit when verifying a Github username. Part of the deposit is used to pay for the Oraclize fee. The remaining amount of the deposit can be withdrawn from the contract after verification is completed.

Once users have registered a username with their Ethereum address they can transfer ownership of the username to a different Ethereum address. Consequently, users only need to verify ownership of a username once.
