pragma solidity ^0.4.6;

import "usingOraclize.sol";
import "strings.sol";

contract GHRegistry is usingOraclize {
  using strings for *;

  struct VerifyUsernameCallback {
    address claimant;
    string username;
  }

  uint public oraclizeGas;
  uint public minCollateral;

  mapping(address => string) public registry;
  mapping(bytes32 => VerifyUsernameCallback) callbacks;
  mapping(address => uint) collaterals;

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
    OAR = OraclizeAddrResolverI(0x6f485c8bf6fc43ea212e93bbf8ce046c7f1cb475);

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

    if (checkGist(result, c.claimant, c.username)) {
      registry[c.claimant] = c.username;

      VerifyUsernameComplete(true, c.claimant, c.username);
    } else {
      collaterals[c.claimant]; // Lose collateral

      VerifyUsernameComplete(false, c.claimant, c.username);
    }
  }

  function transfer(address _a) {
    if (bytes(registry[msg.sender]).length <= 0) throw;

    registry[_a] = registry[msg.sender];

    delete registry[msg.sender];
  }

  // UTILS

  // Expect gist to be of the following form:
  // <gh-username>\n<eth-addr>
  function checkGist(string s, address claimant, string username) returns (bool) {
    var contents = s.toSlice();
    var delim = "\n".toSlice();
    var ghUsername = contents.split(delim);

    if (ghUsername.compare(username.toSlice()) != 0) return false;

    var ethAddr = parseAddr(contents.split(delim).toString());

    if (ethAddr != claimant) {
      return false;
    } else {
      return true;
    }
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
}
