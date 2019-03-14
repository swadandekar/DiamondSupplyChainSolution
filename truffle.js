var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'either worry increase noise toddler bamboo essay patch person defense lizard auction';

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/6b0d542a89d04e62b4b1d7a59ee86f58') 
      },
      port:8545,
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000

    }
  }
};