const hre = require("hardhat");
const storeDeployment = require('./util/storeDeployment.js');

async function main() {
  console.log("Deploying verifier...");

  const [deployer] = await ethers.getSigners();

  const Verifier = await hre.ethers.getContractFactory('Verifier');
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  storeDeployment(hre.network.name, verifier, "verifier");

  console.log("Verifier deployed to: ", verifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
