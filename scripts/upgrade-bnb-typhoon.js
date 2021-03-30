const hre = require('hardhat');
const storeDeployment = require('./util/storeDeployment.js');
const loadDeployment = require('./util/loadDeployment.js');
const { load } = require('dotenv');

require('dotenv').config({ path: '../.env' });

async function main() {
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

  const { BNB_AMOUNT, MERKLE_TREE_HEIGHT } = process.env;

  console.log('Checking for existing bnb typhoon');
  const existingTyphoon = loadDeployment(hre.network.name, 'upgradeable-bnbtyphoon-0.1');
  console.log('Found at: ', existingTyphoon.address);

  console.log('Deploying BNB Typhoon contract with specs:');
  console.log('Amount: ', BNB_AMOUNT);
  console.log('Merkle Tree Height: ', MERKLE_TREE_HEIGHT);
  console.log('Verifier: ', verifier.address);
  console.log('Deployer: ', deployer.address);
  console.log('Hasher: ', hasher.address);

  console.log('Upgrading typhoon contract...');
  const BNBTyphoon = await hre.ethers.getContractFactory('BNBTyphoon', {
    libraries: {
      Hasher: hasher.address,
    },
  });

  const bnbtyphoon = await hre.upgrades.upgradeProxy(existingTyphoon.address, BNBTyphoon, {
    unsafeAllowLinkedLibraries: true,
  });

  await bnbtyphoon.deployed();

  console.log('BNB Typhoon deployed to: ', bnbtyphoon.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
