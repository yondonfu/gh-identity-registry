# Github Identity Registry

Decentralized registry linking Ethereum addresses with Github usernames. This was a weekend learning project and a first run at a full-stack Ethereum DApp. The smart contract was built and tested using Truffle, Solidity and TestRPC. The frontend was built using using React/Redux and Webpack.

The GHRegistry contract is deployed on Ropsten testnet: https://testnet.etherscan.io/address/0x1d9c554e814dad53641cc0cebdeccc9c62dcd84b

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

Access the locally running app at `http://localhost:8080/dist`.

You will need to be running a local Ethereum node by using a client like [Geth](https://github.com/ethereum/go-ethereum) or be using an Ethereum browser plugin like [Metamask](https://metamask.io/). Make sure you are using the Ropsten testnet.

If you want to use [TestRPC](https://github.com/ethereumjs/testrpc) you will need to use Oraclize's [ethereum-bridge](https://github.com/oraclize/ethereum-bridge) tool.

# Protocol

`GHRegistry.sol` is the smart contract that maintains the state of the registry. The contract allows users to:

- Verify a Github username and link it with an Ethereum address
- Transfer a Github username linked with an Ethereum address to another Ethereum address

In order to verify that a user owns a Github username, the user must create a gist file on Github with the following format:

```
<github-username>
<eth-address>
```

The user provides the raw content gist url (click on the `Raw` button for the gist file) to the contract as proof.

Example raw gist url: https://gist.githubusercontent.com/yondonfu/20711bc7b0241425b73c12253fda12e5/raw/9fc1f8d6dd43536cc801b585f0203ff8221d9d5d/gistfile1.txt

The contract uses [Oraclize](http://www.oraclize.it/) to access and parse the contents of the provided raw content gist url.

The user also posts collateral when verifying a Github username. Part of the collateral is used to pay for the Oraclize fee. If the username is successfully verified, the user can withdraw the remaining collateral. If the username is not successfully verified, the user's collateral is lost and kept by the contract.

Once users have registered a username with their Ethereum address they can transfer ownership of the username to a different Ethereum address. Consequently, users only need to verify ownership of a username once.

# Possible Improvements

- Optimistic UI. Instead of throwing up a progress spinner for long transactions, display a pending transactions section somewhere in the UI.
- Is there a better form of identity attestation than using a Github gist?
