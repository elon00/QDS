export type MarketCategory = 'All' | 'Crypto' | 'Somnia' | 'Macro' | 'Tech & AI' | 'Sports' | 'Quantum';

export type OutcomeType = 'YES' | 'NO';

export interface PricePoint {
  time: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

export interface Trade {
  id: string;
  marketId: string;
  outcome: OutcomeType;
  type: 'BUY' | 'SELL';
  shares: number;
  pricePerShare: number;
  totalCost: number;
  timestamp: number;
  userAddress: string;
  txHash: string;
}

export interface OrderBookLevel {
  price: number;
  shares: number;
  total: number;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  tags: string[];
  yesPrice: number; // e.g. 0.65 ($0.65 per YES token, pays $1.00 if true)
  noPrice: number;  // e.g. 0.35 ($0.35 per NO token)
  probabilityYes: number; // 65%
  volume24hUSD: number;
  totalLiquidityUSD: number;
  settlementDate: string;
  settlementTimestamp: number;
  oracleSource: string;
  resolutionCriteria: string;
  contractAddress: string;
  creator: string;
  status: 'ACTIVE' | 'RESOLVING' | 'RESOLVED';
  winningOutcome?: OutcomeType;
  priceHistory: PricePoint[];
  orderBook: {
    yesBids: OrderBookLevel[];
    yesAsks: OrderBookLevel[];
    noBids: OrderBookLevel[];
    noAsks: OrderBookLevel[];
  };
  openInterestUSD: number;
  change24h: number; // e.g. +4.5%
  featured?: boolean;
}

export interface UserPosition {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: OutcomeType;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  potentialPayout: number;
  settlementDate: string;
  status: 'OPEN' | 'RESOLVED_WON' | 'RESOLVED_LOST' | 'CLAIMED';
  claimedAmount?: number;
}

export interface AIAnalysis {
  marketId: string;
  marketTitle: string;
  impliedProb: number;
  aiEstimatedProb: number;
  edgePercent: number;
  recommendation: 'STRONG_BUY_YES' | 'BUY_YES' | 'NEUTRAL' | 'BUY_NO' | 'STRONG_BUY_NO';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number; // 0 - 100
  catalystEvents: string[];
  bullCase: string;
  bearCase: string;
  explainabilitySummary: string;
  suggestedAction: string;
  calculatedAt: string;
}

// Agentic Multimodal Chat Types
export type AgentModelId = 'gemini-3.7-flash-thinking' | 'gemini-3.1-pro' | 'gemini-3.1-flash' | 'qds-quantum-quant' | 'qds-deep-agent';

export interface AgentModel {
  id: AgentModelId;
  name: string;
  tagline: string;
  badge: string;
  provider: string;
  reasoningEffort: 'HIGH' | 'MAX' | 'BALANCED';
  isQuantumReady: boolean;
}

export interface AgentToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'PENDING' | 'EXECUTING' | 'SUCCESS' | 'FAILED';
  result?: string;
  executionMs?: number;
}

export interface AgentReasoningStep {
  title: string;
  detail: string;
  status: 'planning' | 'evaluating' | 'tool_call' | 'complete';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelId?: AgentModelId;
  marketId?: string;
  aiAnalysis?: Partial<AIAnalysis>;
  reasoningSteps?: AgentReasoningStep[];
  toolCalls?: AgentToolCall[];
  attachments?: {
    name: string;
    type: string;
    dataUrl?: string;
  }[];
  actionSuggestion?: {
    type: 'TRADE' | 'LAUNCH_TOKEN' | 'PQC_SIGN' | 'CONWAY_SEED';
    marketId?: string;
    tokenSymbol?: string;
    outcome?: OutcomeType;
    suggestedAmount?: number;
    reason: string;
  };
}

// Token Launchpad Types
export interface LaunchpadToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  creator: string;
  createdAt: number;
  marketCapUSD: number;
  currentPriceUSD: number;
  bondingProgressPercent: number; // 0 to 100%
  graduated: boolean;
  tokensSold: number;
  totalSupply: number;
  reserveBalanceUSDso: number;
  holdersCount: number;
  volume24hUSD: number;
  change24h: number;
  category: 'MEME' | 'AI_AGENT' | 'QUANTUM' | 'PREDICTION_DAO' | 'DEFI';
  aiSafetyScore: number; // 0 - 100%
  aiSafetyFlags: string[];
  associatedMarketId?: string;
  priceHistory: { time: string; price: number; volume: number }[];
}

export interface UserTokenHolding {
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogo: string;
  balance: number;
  avgBuyPrice: number;
  totalCostUSD: number;
  currentValueUSD: number;
  pnlUSD: number;
  pnlPercent: number;
}

// Post-Quantum Cryptography (PQC) Types
export interface PqcKeyPair {
  id: string;
  algorithm: 'CRYSTALS-Kyber-1024' | 'CRYSTALS-Dilithium-5' | 'Falcon-1024' | 'SPHINCS+-SHA2-256f';
  publicKey: string;
  privateKeyHash: string;
  entropyHex: string;
  latticeDimension: number;
  securityLevelBits: number;
  createdAt: number;
  active: boolean;
  totalSignatures: number;
}

export interface PqcSignedTransaction {
  id: string;
  txHash: string;
  rawPayload: string;
  algorithm: string;
  latticeSignatureProof: string;
  verifierStatus: 'VALID_QUANTUM_RESISTANT' | 'VERIFYING' | 'REJECTED';
  executionTimeMs: number;
  timestamp: number;
}

// Conway AI Automaton Types
export interface AutomatonCell {
  x: number;
  y: number;
  age: number;
  energy: number;
  type: 'trader' | 'arbitrageur' | 'liquidity_pool' | 'quantum_node';
}

export interface AutomatonPreset {
  id: string;
  name: string;
  description: string;
  patternType: 'GLIDER_GUN' | 'PULSAR' | 'GOSPER' | 'CHAOS_BREEDER' | 'QUANTUM_LATTICE' | 'MARKET_SHOCKWAVE';
  grid: number[][];
  marketEffect: string;
}

export interface AutomatonTelemetry {
  generation: number;
  liveCellCount: number;
  densityPercent: number;
  marketEntropy: number;
  volatilityIndex: number;
  liquidityClustering: number;
  quantumEntanglementCoeff: number;
}

export interface BotStrategy {
  id: string;
  name: string;
  description: string;
  strategyType: 'SENTIMENT_MOMENTUM' | 'ARBITRAGE_REBALANCER' | 'ORACLE_HEDGER' | 'VOLATILITY_SNIPER';
  targetCategory: MarketCategory;
  minConfidence: number;
  maxRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  allocationUSD: number;
  active: boolean;
  tradesExecuted: number;
  totalProfitUSD: number;
  winRate: number;
  lastRun: string;
  codePreview?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string;
  network: string;
  chainId: number;
  sttBalance: number; // Somnia Testnet Token
  usdsoBalance: number; // QDS stablecoin
  isConnecting: boolean;
  pqcShieldActive: boolean;
  activePqcKey?: PqcKeyPair;
}

export interface TransactionReceipt {
  txHash: string;
  blockNumber: number;
  gasUsedSTT: number;
  marketTitle: string;
  outcome?: OutcomeType;
  shares?: number;
  totalCostUSDso: number;
  timestamp: number;
  status: 'CONFIRMED' | 'FAILED';
  pqcVerified?: boolean;
}
