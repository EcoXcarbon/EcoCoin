const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Your MetaMask local account
  const ecoCoinAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Your deployed contract

  const EcoCoin = await hre.ethers.getContractFactory("EcoCoin");
  const ecoCoin = await EcoCoin.attach(ecoCoinAddress);

  const amount = hre.ethers.parseUnits("1000", 18); // Mint 1000 ECO
  const tx = await ecoCoin.mint(recipient, amount);
  await tx.wait();

  console.log(`✅ Minted 1000 ECO to ${recipient}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
