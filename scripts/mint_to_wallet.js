const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Attach to the deployed EcoCoin contract
    const eco = await ethers.getContractAt("EcoCoin", "0x9A676e781A523b5d0C0e43731313A708CB607508");

    // ✅ Correct MetaMask wallet address
    const to = "0x77D6D5947dEa28A15244444fF8a4E86467B47Ab3";

    // Mint 1000 ECO
    const amount = ethers.parseUnits("1000", 18);

    const tx = await eco.mint(to, amount);
    await tx.wait();

    console.log(`✅ Minted 1000 ECO to ${to}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
