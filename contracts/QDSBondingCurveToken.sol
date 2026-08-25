// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QDSBondingCurveToken
 * @notice Fair-launch ERC20 token governed by a quadratic bonding curve:
 * P(S) = P_0 + k * S^2.
 * Automated DEX graduation when the bonding reserve reaches the threshold (e.g. 69,000 USDso).
 */
contract QDSBondingCurveToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18; // 1 Billion tokens

    uint256 public constant GRADUATION_THRESHOLD_WEI = 69_000 ether; // 69,000 USDso/STT equivalent
    uint256 public constant INITIAL_PRICE_WEI = 0.00001 ether;
    uint256 public constant CURVE_K = 1e10; // Quadratic coefficient

    uint256 public reserveBalance;
    bool public isGraduated;
    address public immutable creator;
    address public somniaDexRouter;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensMinted(address indexed buyer, uint256 tokensAmount, uint256 costWei);
    event TokensBurned(address indexed seller, uint256 tokensAmount, uint256 refundWei);
    event GraduatedToSomniaDEX(uint256 liquidityLockedWei, uint256 tokensLocked);

    constructor(
        string memory _name,
        string memory _symbol,
        address _creator,
        address _somniaDexRouter
    ) {
        name = _name;
        symbol = _symbol;
        creator = _creator;
        somniaDexRouter = _somniaDexRouter;
    }

    /**
     * @notice Calculate current token price based on curve: P(S) = P0 + k * (S / 1e18)^2
     */
    function getCurrentPrice() public view returns (uint256) {
        uint256 supplyUnits = totalSupply / 1e18;
        return INITIAL_PRICE_WEI + (CURVE_K * supplyUnits * supplyUnits);
    }

    /**
     * @notice Buy tokens on the bonding curve
     */
    function buyTokens() external payable returns (uint256 tokensBought) {
        require(!isGraduated, "Token has graduated to Somnia DEX");
        require(msg.value > 0, "Collateral required");

        uint256 currentPrice = getCurrentPrice();
        tokensBought = (msg.value * 1e18) / currentPrice;
        require(totalSupply + tokensBought <= MAX_SUPPLY, "Exceeds max supply");

        reserveBalance += msg.value;
        totalSupply += tokensBought;
        balanceOf[msg.sender] += tokensBought;

        emit Transfer(address(0), msg.sender, tokensBought);
        emit TokensMinted(msg.sender, tokensBought, msg.value);

        // Check graduation trigger
        if (reserveBalance >= GRADUATION_THRESHOLD_WEI) {
            _graduate();
        }
    }

    /**
     * @notice Sell tokens back to the bonding curve reserve
     */
    function sellTokens(uint256 tokenAmount) external returns (uint256 refundWei) {
        require(!isGraduated, "Token has graduated to Somnia DEX");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient balance");

        uint256 currentPrice = getCurrentPrice();
        refundWei = (tokenAmount * currentPrice) / 1e18;
        require(reserveBalance >= refundWei, "Insufficient reserve");

        balanceOf[msg.sender] -= tokenAmount;
        totalSupply -= tokenAmount;
        reserveBalance -= refundWei;

        payable(msg.sender).transfer(refundWei);

        emit Transfer(msg.sender, address(0), tokenAmount);
        emit TokensBurned(msg.sender, tokenAmount, refundWei);
    }

    /**
     * @dev Internal graduation to Somnia DEX liquidity pool
     */
    function _graduate() internal {
        isGraduated = true;
        uint256 liquidityToLock = reserveBalance;
        uint256 tokensToLock = MAX_SUPPLY - totalSupply;

        // Auto-mint remaining tokens to lock in Somnia DEX LP
        balanceOf[somniaDexRouter] += tokensToLock;
        totalSupply += tokensToLock;

        emit Transfer(address(0), somniaDexRouter, tokensToLock);
        emit GraduatedToSomniaDEX(liquidityToLock, tokensToLock);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}
