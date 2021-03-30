const { ethers, network } = require('hardhat');

const path = require('path');
const fs = require('fs');

const Contract = ethers.Contract;

/**
 * Store the deployment
 *
 * @param {string} networkName
 * @param {Contract} contract
 * @param {string} id
 */
module.exports = function storeDeployment(networkName, contract, id) {
  const data = {
    address: contract.address,
    transactionHash: contract.deployTransaction.hash,
  };

  const dir = path.join(__dirname, '..', '..', 'deployments');
  fs.mkdirSync(dir, { recursive: true });

  const outputPath = path.join(dir, networkName + '.json');
  let db = {};
  try {
    db = JSON.parse(fs.readFileSync(outputPath));
  } catch (error) {
    db = {};
  }

  db[id] = data;

  fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));
};
