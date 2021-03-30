require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-web3');

const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.6.2',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'testnet',
  networks: {
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      accounts: { mnemonic },
    },
    testnet: {
      url: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      chainId: 97,
      accounts: { mnemonic },
    },
  },
};
