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

  console.log('Deploying BNB Typhoon contract with specs:');
  console.log('Amount: ', BNB_AMOUNT);
  console.log('Merkle Tree Height: ', MERKLE_TREE_HEIGHT);
  console.log('Verifier: ', verifier.address);
  console.log('Deployer: ', deployer.address);
  console.log('Hasher: ', hasher.address);

  console.log('Deploying typhoon...');
  const BNBTyphoon = await hre.ethers.getContractFactory('BNBTyphoon', {
    libraries: {
      Hasher: hasher.address,
    },
  });

  const bnbtyphoon = await hre.upgrades.deployProxy(
    BNBTyphoon,
    [verifier.address, BNB_AMOUNT, MERKLE_TREE_HEIGHT, deployer.address],
    { unsafeAllowLinkedLibraries: true, initializer: 'initialize(address, uint256, uint32, address)' },
  );
  // const bnbtyphoon = await BNBTyphoon.deploy(verifier.address, BNB_AMOUNT, MERKLE_TREE_HEIGHT, deployer.address);
  await bnbtyphoon.deployed();

  storeDeployment(hre.network.name, bnbtyphoon, 'bnbtyphoon-' + BNB_AMOUNT);

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
