const hre = require("hardhat");

async function main() {
  const [staker] = await hre.ethers.getSigners();

  const ecoCoin = await hre.ethers.getContractAt(
    "EcoCoin",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // your contract address
  );

  const amount = hre.ethers.parseUnits("100", 18); // Unstake the full 100 ECO

  const tx = await ecoCoin.connect(staker).unstake(amount);
  await tx.wait();

  console.log(`✅ Unstaked ${hre.ethers.formatUnits(amount, 18)} ECO + received rewards`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
