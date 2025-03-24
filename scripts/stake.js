const hre = require("hardhat");

async function main() {
  const [staker] = await hre.ethers.getSigners();

  const ecoCoin = await hre.ethers.getContractAt(
    "EcoCoin",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // <- your deployed contract address
  );

  const amount = hre.ethers.parseUnits("100", 18); // staking 100 ECO

  const tx = await ecoCoin.connect(staker).stake(amount);
  await tx.wait();

  console.log(`🌱 Staked 100 EcoCoins from ${staker.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
