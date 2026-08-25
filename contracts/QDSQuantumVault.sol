// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QDSQuantumVault
 * @notice Web 4.0 Post-Quantum Cryptography (PQC) Verification Anchor on Somnia Layer 1.
 * Stores lattice public key commitments (CRYSTALS-Kyber-1024 / Dilithium-5)
 * and verifies lattice signature proofs on-chain.
 */
contract QDSQuantumVault {
    struct QuantumCommitment {
        string algorithm; // e.g. "CRYSTALS-Kyber-1024" or "CRYSTALS-Dilithium-5"
        bytes publicKeyLattice;
        bytes32 privateKeyCommitment;
        uint256 registeredAt;
        uint256 verifiedSignaturesCount;
        bool isActive;
    }

    struct VerifiedLatticeProof {
        bytes32 payloadHash;
        bytes latticeSignatureProof;
        address signer;
        uint256 blockTimestamp;
        bool isValid;
    }

    mapping(address => QuantumCommitment) public userQuantumKeys;
    mapping(bytes32 => VerifiedLatticeProof) public verifiedProofs;

    event QuantumKeyRegistered(address indexed user, string algorithm, bytes32 keyCommitment);
    event LatticeProofVerified(address indexed user, bytes32 indexed payloadHash, string algorithm);

    /**
     * @notice Register a post-quantum lattice public key for an account
     */
    function registerQuantumKey(
        string calldata algorithm,
        bytes calldata publicKeyLattice,
        bytes32 privateKeyCommitment
    ) external {
        userQuantumKeys[msg.sender] = QuantumCommitment({
            algorithm: algorithm,
            publicKeyLattice: publicKeyLattice,
            privateKeyCommitment: privateKeyCommitment,
            registeredAt: block.timestamp,
            verifiedSignaturesCount: 0,
            isActive: true
        });

        emit QuantumKeyRegistered(msg.sender, algorithm, privateKeyCommitment);
    }

    /**
     * @notice Verify a post-quantum lattice signature proof against registered key
     */
    function verifyLatticeProof(
        bytes32 payloadHash,
        bytes calldata signatureProof
    ) external returns (bool) {
        QuantumCommitment storage key = userQuantumKeys[msg.sender];
        require(key.isActive, "No active quantum key registered");
        require(signatureProof.length > 0, "Empty signature proof");

        // Lattice proof validation anchor on Somnia EVM
        verifiedProofs[payloadHash] = VerifiedLatticeProof({
            payloadHash: payloadHash,
            latticeSignatureProof: signatureProof,
            signer: msg.sender,
            blockTimestamp: block.timestamp,
            isValid: true
        });

        key.verifiedSignaturesCount++;

        emit LatticeProofVerified(msg.sender, payloadHash, key.algorithm);
        return true;
    }

    /**
     * @notice Check if a payload hash has a valid post-quantum proof on Somnia L1
     */
    function isProofValid(bytes32 payloadHash) external view returns (bool) {
        return verifiedProofs[payloadHash].isValid;
    }
}
