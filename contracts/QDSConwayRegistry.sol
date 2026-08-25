// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QDSConwayRegistry
 * @notice On-chain Emergent Cellular Automaton Market State Recorder on Somnia Layer 1.
 * Records generation ticks, cellular entropy, volatility indices, and liquidity cluster states.
 */
contract QDSConwayRegistry {
    struct SimulationState {
        uint256 generation;
        uint256 liveCellCount;
        uint256 densityBps;       // Basis points (100 = 1%)
        uint256 volatilityIndex;  // 0 to 100
        uint256 marketEntropy;    // Scaled by 1e4
        bytes compressedGridHash; // Merkle root / hash of 36x36 cellular state
        uint256 recordedAt;
        address authorAgent;
    }

    uint256 public totalTicksRecorded;
    mapping(uint256 => SimulationState) public generationHistory;
    SimulationState public latestState;

    event CellularTickCommitted(
        uint256 indexed generation,
        uint256 liveCells,
        uint256 volatilityIndex,
        uint256 entropy,
        address indexed author
    );

    /**
     * @notice Commit a cellular generation tick to Somnia blockchain
     */
    function recordGenerationTick(
        uint256 generation,
        uint256 liveCellCount,
        uint256 densityBps,
        uint256 volatilityIndex,
        uint256 marketEntropy,
        bytes calldata compressedGridHash
    ) external {
        SimulationState memory newState = SimulationState({
            generation: generation,
            liveCellCount: liveCellCount,
            densityBps: densityBps,
            volatilityIndex: volatilityIndex,
            marketEntropy: marketEntropy,
            compressedGridHash: compressedGridHash,
            recordedAt: block.timestamp,
            authorAgent: msg.sender
        });

        generationHistory[generation] = newState;
        latestState = newState;
        totalTicksRecorded++;

        emit CellularTickCommitted(
            generation,
            liveCellCount,
            volatilityIndex,
            marketEntropy,
            msg.sender
        );
    }
}
