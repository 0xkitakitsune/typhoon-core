const { ethers, network } = require('hardhat');

const path = require('path');
const fs = require('fs');

/** 
 * Store the deployment
 * 
 * @param {string} networkName 
 * @param {string} id 
 */
module.exports = function loadDeployment(networkName, id) {
    const dir = path.join(__dirname, '..', '..', 'deployments');
    const outputPath = path.join(dir, networkName + ".json");

    let db = {};
    try {
        db = JSON.parse(fs.readFileSync(outputPath));
    } catch (error) {
        db = {};
    }

    if (db[id] === undefined) {
        return null;
    }

    return db[id];
}