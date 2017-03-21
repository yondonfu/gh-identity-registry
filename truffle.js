module.exports = {
  networks: {
    testrpc: {
      host: "localhost",
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      from: "0xb400eba440b3c1a8d5d15873b8387e7f111796e8",
      host: "localhost",
      port: 8545,
      network_id: 3
    }
  },
  migrations_directory: './migrations'
};
