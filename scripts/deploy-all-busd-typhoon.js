const hre = require('hardhat');
const storeDeployment = require('./util/storeDeployment.js');
const loadDeployment = require('./util/loadDeployment.js');
const { load } = require('dotenv');

const ethers = hre.ethers;

require('dotenv').config({ path: '../.env' });

async function main() {
  let tokenAddress = '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'; // BUSD testnet
  if (hre.network.name === 'mainnet') {
    tokenAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'; // BUSD mainnet
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await deployer.getBalance()).toString());

  console.log('Checking for deployed hasher/verifier');

  const hasher = loadDeployment(hre.network.name, 'hasher');
  const verifier = loadDeployment(hre.network.name, 'verifier');

  if (hasher === null) {
    console.error('error: hasher not set');
    return;
  }

  if (verifier === null) {
    console.error('error: verifier not set');
    return;
  }

  const { MERKLE_TREE_HEIGHT } = process.env;

  const conf = {
    10: ethers.utils.parseEther('10'),
    100: ethers.utils.parseEther('100'),
    1000: ethers.utils.parseEther('1000'),
    10000: ethers.utils.parseEther('10000'),
  };

  console.log('Deploying BUSD Typhoon contract with specs:');
  console.log('Merkle Tree Height: ', MERKLE_TREE_HEIGHT);
  console.log('Verifier: ', verifier.address);
  console.log('Deployer: ', deployer.address);
  console.log('Hasher: ', hasher.address);

  for (let k in conf) {
    const v = conf[k];
    console.log(`Deploying ${k} BUSD typhoon...`);
    const BNBTyphoon = await hre.ethers.getContractFactory('BEP20Typhoon', {
      libraries: {
        Hasher: hasher.address,
      },
    });
    const bnbtyphoon = await hre.upgrades.deployProxy(
      BNBTyphoon,
      [verifier.address, v, MERKLE_TREE_HEIGHT, deployer.address, tokenAddress],
      {
        unsafeAllowLinkedLibraries: true,
        initializer: 'initialize(address, uint256, uint32, address, address)',
      },
    );
    await bnbtyphoon.deployed();

    storeDeployment(hre.network.name, bnbtyphoon, 'upgradeable-busd-typhoon-' + k);

    console.log(`BUSD Typhoon ${k} deployed to: `, bnbtyphoon.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
