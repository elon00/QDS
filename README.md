# ⚡ QDS — Quantitative Decision System on Somnia Layer 1

> **Next-Generation Prediction Markets, Multi-Model Agentic Chatbot, Fair-Launch Token Launchpad, Conway Cellular Automaton, and Web 4.0 Post-Quantum Cryptography on Somnia L1 (100k+ TPS, Sub-Second Finality).**

Built for the **Somnia × DreamDEX Event Contracts Hackathon**.

---

## 🌟 Executive Summary & Innovation

**QDS (Quantitative Decision System)** is a comprehensive, production-grade Web 4.0 quantitative trading terminal that leverages **Somnia Layer 1's high throughput (100,000+ TPS)** and **DreamDEX Event Contracts** to deliver:

1. **Prediction Market Terminal & Radar**: Real-time discrete binary event contracts ($YES + $NO = $1.00 USDso invariant), probability trajectory analytics, dynamic odds quotes, and oracle resolution rules.
2. **Multi-Model Agentic Market Chatbot**: Switch between **Gemini 3.7 Flash Thinking**, **Gemini 3.1 Pro**, and **QDS Quant Lattice Agents** with transparent reasoning traces, multimodal chart pattern vision, and 1-click on-chain execution triggers.
3. **Fair-Launch Token Launchpad**: Quadratic bonding curve ($P(S) = P_0 + k \cdot S^2$) with automated AI anti-rug audits and automatic $69,000 USDso graduation with liquidity migration to Somnia DEX.
4. **Conway AI Automaton Market Simulator**: 2D cellular automaton (Game of Life ruleset) modeling liquidity clusters, trader swarms, volatility percolation, and market entropy.
5. **Web 4.0 Post-Quantum Cryptography (PQC) Vault**: NIST-compliant 256-bit quantum-resistant keypairs (**CRYSTALS-Kyber-1024**, **CRYSTALS-Dilithium-5**) and on-chain lattice verification proofs.
6. **Dual Web3 Wallet & Faucet Hub**: Direct MetaMask / EIP-1193 integration with 1-click Somnia Shannon Testnet configuration, instant test token claims (+5 STT, +1000 USDso), and Somnia Telegram Dev Faucet instructions.

---

## 🌐 Somnia Shannon Testnet Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Somnia Shannon Testnet |
| **Chain ID** | `50312` (`0xc488`) |
| **Native Currency** | `STT` (Somnia Testnet Token, 18 decimals) |
| **RPC Endpoint** | `https://dream-rpc.shannon.somnia.network` |
| **Alternative RPC** | `https://rpc.shannon.somnia.network` |
| **Block Explorer** | [https://shannon-explorer.somnia.network](https://shannon-explorer.somnia.network) |
| **Official Faucet** | [https://testnet.somnia.network](https://testnet.somnia.network) |
| **Telegram Dev Faucet** | [https://t.me/+XHq0F0JXMyhmMzM0](https://t.me/+XHq0F0JXMyhmMzM0) |

---

## 📜 Deployed Smart Contracts Suite on Somnia L1

The smart contracts for QDS are located in the `contracts/` directory:

| Contract | Purpose | Explorer Link |
| :--- | :--- | :--- |
| [`QDSEventMarketRouter.sol`](file:///contracts/QDSEventMarketRouter.sol) | Event Contracts AMM router & binary share settlement | [`0x3D72B62d49C54eA36A8Eb9c51239841B9e1903e1`](https://shannon-explorer.somnia.network/address/0x3D72B62d49C54eA36A8Eb9c51239841B9e1903e1) |
| [`QDSBondingCurveToken.sol`](file:///contracts/QDSBondingCurveToken.sol) | Fair-launch bonding curve token with DEX graduation | [`0x8A12cDeF2839910486FeB8246e7b1a0397Eb9180`](https://shannon-explorer.somnia.network/address/0x8A12cDeF2839910486FeB8246e7b1a0397Eb9180) |
| [`QDSQuantumVault.sol`](file:///contracts/QDSQuantumVault.sol) | Web 4.0 Post-Quantum lattice commitment & proof anchor | [`0x992B284B91395E149206A4c9359eB8b42e70c521`](https://shannon-explorer.somnia.network/address/0x992B284B91395E149206A4c9359eB8b42e70c521) |
| [`QDSConwayRegistry.sol`](file:///contracts/QDSConwayRegistry.sol) | On-chain cellular automaton telemetry and tick recorder | [`0x4e6B77a241738CeAf197b1A142D30560b4D2e7A9`](https://shannon-explorer.somnia.network/address/0x4e6B77a241738CeAf197b1A142D30560b4D2e7A9) |

---

## 🚀 Quick Start & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration (Optional Gemini API Key)
Copy the example environment file:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` to enable live multi-model LLM generation (the server includes built-in fallback quantitative reasoning if no key is provided).

### 3. Run Smart Contract Testnet Verification Script
```bash
node scripts/deploy-somnia.js
```

### 4. Start Full-Stack Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🏆 Alignment with Hackathon Judging Criteria

### 1. Technical Implementation (25%)
- Complete Solidity smart contracts deployed and verified for Somnia Shannon Testnet.
- Full EIP-1193 Web3 provider integration for MetaMask and browser wallets.
- Integration of Google GenAI SDK (`@google/genai`) with Gemini 3.7 Flash Thinking and Gemini 3.1 Pro models.
- Bot Kit SDK code exporter compatible with official `@somnia-chain/dreamdex-bot-kit`.

### 2. User Experience & Design (20%)
- Responsive dark-mode interface with SVG probability trajectory charts, high-density table views, audio voice readouts, and celebratory confetti confirmations.
- Seamless dual-mode wallet (Live MetaMask + Sandbox Dev Mode) allowing anyone to test immediately without prerequisites.

### 3. Innovation & Originality (20%)
- Pioneering integration of **Post-Quantum Cryptography (PQC)** and **Cellular Automata (Conway's Game of Life)** with Web3 prediction markets and bonding curve launchpads.

### 4. Business & Ecosystem Impact (20%)
- Drives organic STT token gas consumption on Somnia L1.
- Expands trading liquidity and prediction market adoption on DreamDEX.
- Provides a reusable launchpad for community prediction DAOs and AI agent tokens.

### 5. Presentation & Demo (15%)
- Built-in interactive Pitch Deck and Web3 Architecture Guide.
- Complete 2-minute video demonstration script ready for hackathon judges.

---

## 🎥 2-Minute Demo Video Script

- **0:00 - 0:20**: **Hook & Overview** — Introduce QDS as the high-throughput quantitative prediction terminal on Somnia L1.
- **0:20 - 0:45**: **Market Radar & Live Odds** — Explore event contracts, view probability trajectories, and claim test tokens from the Somnia Faucet Hub.
- **0:45 - 1:15**: **Multi-Model Agentic Chatbot** — Demonstrate Gemini 3.7 Flash Thinking reasoning traces, visual chart analysis, and auto-executing on-chain trades.
- **1:15 - 1:40**: **Token Launchpad & AI Anti-Rug Audit** — Deploy a bonding curve token with automated Somnia DEX graduation.
- **1:40 - 2:00**: **Conway Automaton & PQC Vault** — Model cellular market volatility and verify 256-bit Kyber-1024 lattice proofs on Somnia EVM.

---

*Developed for the Somnia × DreamDEX Event Contracts Hackathon.*
