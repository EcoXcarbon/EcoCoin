const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const ecoCoin = await hre.ethers.getContractAt(
    "EcoCoin",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // your deployed contract address
  );

  const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // local wallet
  const amount = hre.ethers.parseUnits("1000", 18); // 1000 ECO

  const tx = await ecoCoin.mint(recipient, amount);
  await tx.wait();

  console.log(`✅ Minted 1000 EcoCoins to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
