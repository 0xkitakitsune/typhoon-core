const hre = require("hardhat");
const genContract = require('circomlib/src/mimcsponge_gencontract.js');
const storeDeployment = require('./util/storeDeployment.js');

async function main() {
  console.log("Compiling hasher contract...");
  const contract = {
    contractName: 'Hasher',
    abi: genContract.abi,
    bytecode: genContract.createCode('mimcsponge', 220)
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deploying Hasher...");

  const Hasher = new hre.ethers.ContractFactory(contract.abi, contract.bytecode, deployer);
  const hasher = await Hasher.deploy();
  await hasher.deployed();

  storeDeployment(hre.network.name, hasher, "hasher");

  console.log("Hasher deployed to: ", hasher.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
