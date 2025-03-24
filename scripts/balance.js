const hre = require("hardhat");

async function main() {
  const ecoCoin = await hre.ethers.getContractAt(
    "EcoCoin",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // your deployed address
  );

  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const balance = await ecoCoin.balanceOf(address);
  console.log(`💰 Balance of ${address}: ${hre.ethers.formatUnits(balance, 18)} ECO`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
