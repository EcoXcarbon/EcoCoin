// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin libraries
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

library DecimalMath {
    function mul(uint256 a, uint256 b, uint256 scale) internal pure returns (uint256) {
        return (a * b) / scale;
    }
}

contract EcoCoin is ERC20, Ownable, Pausable {
    using DecimalMath for uint256;

    struct Staking {
        uint256 amount;
        uint256 stakingTime;
    }

    uint256 public constant TOTAL_TREES = 400000000; // 400 million trees
uint256 public constant CO2_PER_TREE = 25 * 1e15; // 0.025 * 1e18
uint256 public constant TOTAL_CO2 = TOTAL_TREES * CO2_PER_TREE;

    uint256 public stakingRewardRate = 10; // 10% annual reward
    uint256 public totalStaked;


    mapping(address => Staking) public stakedBalance;
    mapping(address => uint256) public carbonCredits;

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event CarbonCreditAdded(address indexed user, uint256 amount);

    constructor() ERC20("EcoCoin", "ECO") {}

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= TOTAL_CO2, "Exceeds total CO2 capacity");
        _mint(to, amount);
        emit Minted(to, amount);
    }

    function mintWithCarbonCredit(address to, uint256 amount, uint256 carbonCreditAmount) public onlyOwner {
        require(carbonCreditAmount >= amount, "Insufficient carbon credits");
        require(totalSupply() + amount <= TOTAL_CO2, "Exceeds total CO2 capacity");
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

        Staking storage s = stakedBalance[msg.sender];
        if (s.amount == 0) {
            s.stakingTime = block.timestamp;
        }
        s.amount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public whenNotPaused {
        require(stakedBalance[msg.sender].amount >= amount, "Insufficient staked balance");

        uint256 stakingDuration = block.timestamp - stakedBalance[msg.sender].stakingTime;
        uint256 reward = (amount * stakingRewardRate * stakingDuration) / (365 days * 100);
        require(totalSupply() + reward <= TOTAL_CO2, "Reward exceeds CO2 cap");

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
}
