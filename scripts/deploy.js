const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // Deploy EcoCoin
  const EcoCoin = await ethers.getContractFactory("EcoCoin");
  const ecoCoin = await EcoCoin.deploy();
  await ecoCoin.waitForDeployment();
  console.log("✅ EcoCoin deployed at:", ecoCoin.target);

  // Deploy EcoStaker with EcoCoin address
  const EcoStaker = await ethers.getContractFactory("EcoStaker");
  const ecoStaker = await EcoStaker.deploy(ecoCoin.target);
  await ecoStaker.waitForDeployment();
  console.log("✅ EcoStaker deployed at:", ecoStaker.target);

  // Deploy EcoFaucet with EcoCoin address
  const EcoFaucet = await ethers.getContractFactory("EcoFaucet");
  const ecoFaucet = await EcoFaucet.deploy(ecoCoin.target);
  await ecoFaucet.waitForDeployment();
  console.log("✅ EcoFaucet deployed at:", ecoFaucet.target);

  console.log("\n🧪 .env-ready values:");
  console.log(`VITE_ECOCOIN_ADDRESS=${ecoCoin.target}`);
  console.log(`VITE_STAKER_ADDRESS=${ecoStaker.target}`);
  console.log(`VITE_FAUCET_ADDRESS=${ecoFaucet.target}`);
  console.log(`VITE_CHAIN_ID=11155111`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
