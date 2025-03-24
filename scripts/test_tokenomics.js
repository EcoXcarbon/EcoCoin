const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deployer address:", deployer.address);

    const EcoCoin = await ethers.getContractFactory("EcoCoin");
    const eco = await EcoCoin.deploy();
    await eco.waitForDeployment(); // ✅ correct way to confirm deploy

    console.log("EcoCoin deployed to:", await eco.getAddress());

    const impact = await eco.ecoImpact();
    console.log("ecoImpact():", impact);

    const trees = await eco.treesPerEco();
    console.log("treesPerEco():", trees.toString());

    const co2 = await eco.co2PerEco();
    console.log("co2PerEco():", ethers.formatUnits(co2, 18), "tons");

    const mintAmount = ethers.parseUnits("100", 18);
    const tx = await eco.mint(deployer.address, mintAmount);
    await tx.wait();

    console.log("Minted 100 ECO to deployer.");

    const balance = await eco.balanceOf(deployer.address);
    console.log("Deployer ECO balance:", ethers.formatUnits(balance, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
