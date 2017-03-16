contract('GHRegistry', function(accounts) {
  it('should match initial contract settings', async function() {
    const minCollateral = web3.toWei(1, 'ether');
    const oraclizeGas = 250000;

    let c = await GHRegistry.new(minCollateral, oraclizeGas);
  });

  it('should verify a Github username and transfer username to another ETH address', async function() {
    const minCollateral = web3.toWei(1, 'ether');
    const oraclizeGas = 250000;

    let c = await GHRegistry.new(minCollateral, oraclizeGas);

    // Verify

    const username = 'yondonfu';
    const gistPath = '/20711bc7b0241425b73c12253fda12e5/raw/87a4e20dff8d5004ad21104584d54d5d42fabd7d/gistfile1.txt';

    await c.verifyUsername(username, gistPath, {from: accounts[0], value: minCollateral});

    let e = c.VerifyUsernameComplete({});

    e.watch(async function(err, result) {
      e.stopWatching();

      if (err) throw err;

      assert.equal(result.args.success, true, 'verification should be successful');

      let registryUsername = await c.registry.call(accounts[0]);

      assert.equal(registryUsername, username, 'registry should have the correct username');

      // Transfer

      await c.transfer(accounts[1], {from: accounts[0]});

      let transferredUsername = await c.registry.call(accounts[1]);
      let blankUsername = await c.registry.call(accounts[0]);

      assert.equal(transferredUsername, username, 'registry should reflect transferred username for new owner');
      assert.equal(blankUsername, '', 'registry should reflect blank username for former owner');
    });

  });
});
