// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract EcoCoin is ERC20, Ownable, Pausable {

    // === EcoCoin Tokenomics ===
    // 1 ECO token represents 10 trees planted (~0.25 tons CO₂/year)

    uint256 public constant TOTAL_TREES = 400_000_000;
    uint256 public constant TREES_PER_ECO = 10;
    uint256 public constant CO2_PER_TREE = 0.025 * 1e18;
    uint256 public constant CO2_PER_ECO = TREES_PER_ECO * CO2_PER_TREE;
    uint256 public constant MAX_SUPPLY = (TOTAL_TREES / TREES_PER_ECO) * 1e18;

    uint256 public stakingRewardRate = 10; // 10% annual reward
    uint256 public totalStaked;

    struct Staking {
        uint256 amount;
        uint256 stakingTime;
    }

    mapping(address => Staking) public stakedBalance;
    mapping(address => uint256) public carbonCredits;

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event CarbonCreditAdded(address indexed user, uint256 amount);

    constructor() ERC20("EcoCoin", "ECO") {}

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds total ECO cap based on tree logic");
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function mintWithCarbonCredit(address to, uint256 amount, uint256 carbonCreditAmount) public onlyOwner {
        require(carbonCreditAmount >= amount, "Insufficient carbon credits");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds total ECO cap");
        _mint(to, amount);
        carbonCredits[to] += carbonCreditAmount;
        emit Minted(to, amount);
        emit CarbonCreditAdded(to, carbonCreditAmount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }

    function stake(uint256 amount) public whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        stakedBalance[msg.sender].amount += amount;
        stakedBalance[msg.sender].stakingTime = block.timestamp;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public whenNotPaused {
        require(stakedBalance[msg.sender].amount >= amount, "Insufficient staked balance");

        uint256 stakingDuration = block.timestamp - stakedBalance[msg.sender].stakingTime;
        uint256 reward = (amount * stakingRewardRate * stakingDuration) / (365 days * 100);

        _mint(msg.sender, reward);
        _transfer(address(this), msg.sender, amount);

        stakedBalance[msg.sender].amount -= amount;
        totalStaked -= amount;
        emit Unstaked(msg.sender, amount, reward);
    }

    function addCarbonCredits(address to, uint256 amount) public onlyOwner {
        carbonCredits[to] += amount;
        emit CarbonCreditAdded(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function transfer(address recipient, uint256 amount) public override whenNotPaused returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        return super.transfer(recipient, amount);
    }

    function ecoImpact() public pure returns (string memory) {
        return "1 ECO = 10 trees planted (~0.25 tons CO2/year)";
    }

    function co2PerEco() public pure returns (uint256) {
        return CO2_PER_ECO;
    }

    function treesPerEco() public pure returns (uint256) {
        return TREES_PER_ECO;
    }
}
