// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const EcoCoin = await hre.ethers.getContractFactory("EcoCoin");
  const ecoCoin = await EcoCoin.deploy();

  await ecoCoin.waitForDeployment(); // ✅ Replace .deployed() with correct method for newer Hardhat

  console.log(`EcoCoin deployed to: ${ecoCoin.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
