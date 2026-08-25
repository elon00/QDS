import { PqcKeyPair, PqcSignedTransaction } from '../types';

export const INITIAL_PQC_KEYS: PqcKeyPair[] = [
  {
    id: 'pqc-key-kyber1024',
    algorithm: 'CRYSTALS-Kyber-1024',
    publicKey: '0xkyber1024_7a8f9c2d1e0b5a43f8921e4d7a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    privateKeyHash: '0xsha3_512_89f02c918a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    entropyHex: '0x9928AF81B3CD099238FF1832AB90123984E01',
    latticeDimension: 1024,
    securityLevelBits: 256,
    createdAt: Date.now() - 3600 * 1000 * 72,
    active: true,
    totalSignatures: 48
  },
  {
    id: 'pqc-key-dilithium5',
    algorithm: 'CRYSTALS-Dilithium-5',
    publicKey: '0xdilithium5_1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    privateKeyHash: '0xsha3_512_11e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
    entropyHex: '0x32A90F8812CD4492389182390123490012E44',
    latticeDimension: 896,
    securityLevelBits: 256,
    createdAt: Date.now() - 3600 * 1000 * 24,
    active: false,
    totalSignatures: 14
  },
  {
    id: 'pqc-key-falcon1024',
    algorithm: 'Falcon-1024',
    publicKey: '0xfalcon1024_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a',
    privateKeyHash: '0xsha3_512_44f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
    entropyHex: '0x88912AC9910238475619283746501928374650192',
    latticeDimension: 1024,
    securityLevelBits: 256,
    createdAt: Date.now() - 3600 * 1000 * 12,
    active: false,
    totalSignatures: 6
  }
];

export const INITIAL_PQC_TRANSACTIONS: PqcSignedTransaction[] = [
  {
    id: 'pqc-tx-001',
    txHash: '0x7a81...492b',
    rawPayload: '{"method":"buyOutcomeShares","marketId":"somnia-tps-100k","shares":250,"collateralUSDso":170}',
    algorithm: 'CRYSTALS-Kyber-1024',
    latticeSignatureProof: '0xPQC_LATTICE_PROOF_K1024_09a8f273b4e819d02c7e61a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
    verifierStatus: 'VALID_QUANTUM_RESISTANT',
    executionTimeMs: 1.4,
    timestamp: Date.now() - 3600 * 1000 * 2
  },
  {
    id: 'pqc-tx-002',
    txHash: '0x32c4...881f',
    rawPayload: '{"method":"mintBondingCurveToken","tokenId":"tok-somnia-cat","usdsoAmount":500}',
    algorithm: 'CRYSTALS-Kyber-1024',
    latticeSignatureProof: '0xPQC_LATTICE_PROOF_K1024_ff8921e4d7a8b9c0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    verifierStatus: 'VALID_QUANTUM_RESISTANT',
    executionTimeMs: 1.8,
    timestamp: Date.now() - 3600 * 1000 * 5
  },
  {
    id: 'pqc-tx-003',
    txHash: '0x99e1...120a',
    rawPayload: '{"method":"deployAutomatonSeed","preset":"GLIDER_GUN","entropyRate":0.94}',
    algorithm: 'CRYSTALS-Dilithium-5',
    latticeSignatureProof: '0xPQC_LATTICE_PROOF_DIL5_8819283746501928374650192837465019283746501928374650192837465019',
    verifierStatus: 'VALID_QUANTUM_RESISTANT',
    executionTimeMs: 2.1,
    timestamp: Date.now() - 3600 * 1000 * 14
  }
];

export const QUANTUM_THREAT_MATRIX = [
  {
    threat: "Shor's Algorithm (ECDSA & RSA-2048)",
    vulnLevel: "100% Critical in Classical EVM",
    qdsProtection: "Protected via Kyber-1024 & Dilithium-5 lattice vectors",
    status: "IMMUNE"
  },
  {
    threat: "Grover's Algorithm (SHA-256 Collision)",
    vulnLevel: "Reduces classical 256-bit to 128-bit effective entropy",
    qdsProtection: "Upgraded to SHA3-512 & 1024-dimension polynomial rings",
    status: "IMMUNE"
  },
  {
    threat: "Harvest Now, Decrypt Later (HNDL Attack)",
    vulnLevel: "State actors intercepting unencrypted transaction payloads",
    qdsProtection: "Forward-secret quantum encapsulated channels (KEM)",
    status: "ACTIVE_SHIELD"
  }
];
