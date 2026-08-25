// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QDSEventMarketRouter
 * @notice Quantitative Prediction Market Router on Somnia Layer 1 (100k+ TPS).
 * Manages binary event creation, share minting/burning, and oracle outcome settlements.
 */
contract QDSEventMarketRouter {
    enum Outcome { UNRESOLVED, YES, NO }

    struct Market {
        bytes32 id;
        string title;
        string oracleSource;
        uint256 settlementTimestamp;
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 totalLiquidity;
        Outcome winningOutcome;
        bool isSettled;
        address creator;
    }

    address public immutable owner;
    uint256 public constant SCALE = 1e18;
    uint256 public marketCount;

    mapping(bytes32 => Market) public markets;
    mapping(bytes32 => mapping(address => uint256)) public userYesShares;
    mapping(bytes32 => mapping(address => uint256)) public userNoShares;

    event MarketCreated(bytes32 indexed marketId, string title, uint256 settlementTimestamp, address creator);
    event SharesPurchased(bytes32 indexed marketId, address indexed buyer, Outcome outcome, uint256 shares, uint256 cost);
    event SharesRedeemed(bytes32 indexed marketId, address indexed redeemer, uint256 payout);
    event MarketResolved(bytes32 indexed marketId, Outcome winningOutcome, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Create a new binary event prediction market
     */
    function createMarket(
        string memory title,
        string memory oracleSource,
        uint256 settlementTimestamp
    ) external returns (bytes32) {
        require(settlementTimestamp > block.timestamp, "Settlement must be in the future");
        
        bytes32 marketId = keccak256(abi.encodePacked(title, oracleSource, settlementTimestamp, marketCount++));
        
        markets[marketId] = Market({
            id: marketId,
            title: title,
            oracleSource: oracleSource,
            settlementTimestamp: settlementTimestamp,
            totalYesShares: 0,
            totalNoShares: 0,
            totalLiquidity: 0,
            winningOutcome: Outcome.UNRESOLVED,
            isSettled: false,
            creator: msg.sender
        });

        emit MarketCreated(marketId, title, settlementTimestamp, msg.sender);
        return marketId;
    }

    /**
     * @notice Buy YES or NO outcome shares using native STT or collateral
     */
    function buyShares(bytes32 marketId, Outcome outcome) external payable returns (uint256 shares) {
        Market storage m = markets[marketId];
        require(!m.isSettled, "Market is already settled");
        require(outcome == Outcome.YES || outcome == Outcome.NO, "Invalid outcome");
        require(msg.value > 0, "Must send collateral");

        // Calculate dynamic shares (Simplified CPMM pricing on Somnia EVM)
        shares = (msg.value * SCALE) / 1e18;

        if (outcome == Outcome.YES) {
            m.totalYesShares += shares;
            userYesShares[marketId][msg.sender] += shares;
        } else {
            m.totalNoShares += shares;
            userNoShares[marketId][msg.sender] += shares;
        }

        m.totalLiquidity += msg.value;

        emit SharesPurchased(marketId, msg.sender, outcome, shares, msg.value);
    }

    /**
     * @notice Resolve market outcome via authorized Oracle or Governance
     */
    function resolveMarket(bytes32 marketId, Outcome outcome) external onlyOwner {
        Market storage m = markets[marketId];
        require(!m.isSettled, "Already settled");
        require(outcome == Outcome.YES || outcome == Outcome.NO, "Invalid winning outcome");

        m.winningOutcome = outcome;
        m.isSettled = true;

        emit MarketResolved(marketId, outcome, block.timestamp);
    }

    /**
     * @notice Redeem payout on a settled market
     */
    function redeemPayout(bytes32 marketId) external returns (uint256 payout) {
        Market storage m = markets[marketId];
        require(m.isSettled, "Market is not settled yet");

        uint256 winningShares = 0;
        if (m.winningOutcome == Outcome.YES) {
            winningShares = userYesShares[marketId][msg.sender];
            userYesShares[marketId][msg.sender] = 0;
        } else if (m.winningOutcome == Outcome.NO) {
            winningShares = userNoShares[marketId][msg.sender];
            userNoShares[marketId][msg.sender] = 0;
        }

        require(winningShares > 0, "No winning shares to redeem");

        // Payout $1.00 unit per winning share
        payout = winningShares;
        payable(msg.sender).transfer(payout);

        emit SharesRedeemed(marketId, msg.sender, payout);
    }
}
