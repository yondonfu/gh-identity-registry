pragma solidity ^0.4.6;

import "../contracts/usingOraclize.sol";
import "../contracts/strings.sol";

contract GHRegistry is usingOraclize {
  using strings for *;

  struct VerifyUsernameCallback {
    address claimant;
    string username;
  }

  uint public oraclizeGas;
  uint public minCollateral;

  address[] public registryEntries;

  mapping(address => string) public registry;
  mapping(bytes32 => VerifyUsernameCallback) callbacks;
  mapping(address => uint) public collaterals;

  string constant gistPrefix = "https://gist.githubusercontent.com/";

  // EVENTS

  event VerifyUsernameComplete(bool success, address claimant, string username);

  // MODIFIERS

  modifier onlyOraclize() {
    if (msg.sender != oraclize_cbAddress()) throw;
    _;
  }

  modifier requiresCollateral() {
    if (msg.value < minCollateral) throw;
    _;
  }

  function GHRegistry(uint _minCollateral, uint _oraclizeGas) {
    OAR = OraclizeAddrResolverI(0x6f485c8bf6fc43ea212e93bbf8ce046c7f1cb475); // Local dev
    minCollateral = _minCollateral;
    oraclizeGas = _oraclizeGas;
  }

  function createGistUrl(string username, string gistPath) returns (string) {
    return gistPrefix.toSlice().concat(username.toSlice()).toSlice().concat(gistPath.toSlice());
  }

  function verifyUsername(string username, string gistPath) payable requiresCollateral {
    uint initialBalance = this.balance;

    bytes32 queryId = oraclize_query('URL', createGistUrl(username, gistPath), oraclizeGas);

    uint updatedBalance = this.balance;

    callbacks[queryId] = VerifyUsernameCallback(msg.sender, username);

    collaterals[msg.sender] += msg.value - (initialBalance - updatedBalance);
  }

  function __callback(bytes32 queryId, string result) onlyOraclize {
    VerifyUsernameCallback memory c = callbacks[queryId];

    if (checkGistAddr(result, c.claimant)) {
      registry[c.claimant] = c.username;
      registryEntries.push(c.claimant);

      VerifyUsernameComplete(true, c.claimant, c.username);
    } else {
      collaterals[c.claimant] = 0; // Lose collateral

      VerifyUsernameComplete(false, c.claimant, c.username);
    }
  }

  function transfer(address _a) {
    if (bytes(registry[msg.sender]).length <= 0) throw;

    registry[_a] = registry[msg.sender];
    registryEntries.push(_a);

    delete registry[msg.sender];
  }

  // UTILS

  // Expect gist to be of the following form:
  // <eth-addr>
  function checkGistAddr(string s, address claimant) returns (bool) {
    var ethAddr = parseAddr(s);

    return ethAddr == claimant;
  }

  function withdrawCollateral() external {
    address payee = msg.sender;

    uint collateral = collaterals[payee];

    if (collateral == 0) throw;
    if (this.balance < collateral) throw;

    collaterals[payee] = 0;

    if (!payee.send(collateral)) {
      collaterals[payee] = collateral;
    }
  }

  function getRegistrySize() public constant returns (uint) {
    return registryEntries.length;
  }

  function getRegistryEntry(uint idx) public constant returns (address, string) {
    address addr = registryEntries[idx];

    return (addr, registry[addr]);
  }
}
