const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners(); // Project owner

  const ecoCoin = await hre.ethers.getContractAt(
    "EcoCoin",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // your deployed address
  );

  const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // your wallet
  const carbonAmount = hre.ethers.parseUnits("100", 18); // 100 carbon credits

  const tx = await ecoCoin.connect(owner).addCarbonCredits(recipient, carbonAmount);
  await tx.wait();

  console.log(`✅ Added 100 carbon credits to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

