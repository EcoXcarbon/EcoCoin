const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying EcoCoin with account:", deployer.address);
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer ETH balance:", ethers.formatEther(balance), "ETH");

    const EcoCoin = await ethers.getContractFactory("EcoCoin");
    const eco = await EcoCoin.deploy();
    await eco.waitForDeployment();

    const ecoAddress = await eco.getAddress();
    console.log("EcoCoin deployed to:", ecoAddress);
    console.log("✅ Add this address as a Custom Token in MetaMask");
    console.log("   Token Address:", ecoAddress);
    console.log("   Token Symbol: ECO");
    console.log("   Decimals: 18");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
