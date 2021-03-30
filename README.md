# Typhoon.network

Typhoon is a zero-knowledge protocol that enables users to send private transactions between 2 BSC wallets by utilizing zkSNARK-based cryptography. By using Typhoon to transfer funds, it is no longer possible to determine who sent the transaction in the first place, thus providing anonymity and privacy ontop of an otherwise public blockchain.

## Deploy

`scripts/` is containing hardhat scripts to deploy the smart contracts to BSC. `deployments/` is holding the status of the latest deploy, reflecting the current contracts for mainnet and testnet.

```bash
npx hardhat run --network testnet scripts/deploy-bnb-typhoon.js
```

### Upgrading

Typhoon is following the proxy pattern. To learn how to upgrade the contracts, check `scripts/upgrade-bnb-typhoon.js`

## Setup

```bash
yarn install
cp .env.example .env
```
