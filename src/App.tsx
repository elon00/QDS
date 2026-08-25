import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Flame, 
  Layers, 
  Bot, 
  TrendingUp, 
  ArrowUpDown, 
  LayoutGrid, 
  Table as TableIcon,
  ShieldCheck,
  Radio,
  Zap,
  ArrowRight,
  Droplet,
  Globe,
  SlidersHorizontal,
  Rocket,
  Cpu
} from 'lucide-react';
import { Market, MarketCategory, OutcomeType, UserPosition, WalletState, TransactionReceipt } from './types';
import { INITIAL_MARKETS, INITIAL_USER_POSITIONS } from './data/mockMarkets';
import { Navbar, NavTabType } from './components/Navbar';
import { MarketCard } from './components/MarketCard';
import { MarketDetailModal } from './components/MarketDetailModal';
import { TransactionSigningModal } from './components/TransactionSigningModal';
import { PortfolioView } from './components/PortfolioView';
import { BotKitStudio } from './components/BotKitStudio';
import { Web3StoryGuide } from './components/Web3StoryGuide';
import { HackathonPitchDeck } from './components/HackathonPitchDeck';
import { FaucetModal } from './components/FaucetModal';
import { AgenticChatbot } from './components/AgenticChatbot';
import { ConwayAutomaton } from './components/ConwayAutomaton';
import { TokenLaunchpad } from './components/TokenLaunchpad';
import { Web4PqcVault } from './components/Web4PqcVault';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<NavTabType>('radar');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Markets State
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('All');
  const [sortBy, setSortBy] = useState<'volume' | 'change' | 'probability' | 'newest'>('volume');

  // Interactive Modals
  const [detailModalMarket, setDetailModalMarket] = useState<Market | null>(null);
  const [faucetOpen, setFaucetOpen] = useState(false);

  // Transaction Execution State
  const [signingModalData, setSigningModalData] = useState<{
    isOpen: boolean;
    market: Market | null;
    outcome: OutcomeType;
    amountUSDso: number;
  }>({
    isOpen: false,
    market: null,
    outcome: 'YES',
    amountUSDso: 25,
  });

  // Wallet & User State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true,
    address: '0x8fB2aC9981e4D2e7208C90C51322f2Eb9e8c4601',
    network: 'Somnia Shannon Testnet',
    chainId: 50312,
    sttBalance: 4.82,
    usdsoBalance: 850.00,
    isConnecting: false,
  });

  // User Positions & Trade History
  const [positions, setPositions] = useState<UserPosition[]>(INITIAL_USER_POSITIONS);
  const [tradeHistory, setTradeHistory] = useState<TransactionReceipt[]>([
    {
      txHash: '0x9b5f12e847c5980a3182eb6109df3421ea94b219087c53d162a809f6b47101de',
      blockNumber: 3828940,
      gasUsedSTT: 0.00038,
      marketTitle: 'Will Somnia L1 reach > 100,000 TPS verified on Testnet before Q4 2026?',
      outcome: 'YES',
      shares: 500,
      totalCostUSDso: 370,
      timestamp: Date.now() - 3600000 * 2,
      status: 'CONFIRMED',
    }
  ]);

  // Categories list
  const categories: MarketCategory[] = ['All', 'Crypto', 'Somnia', 'Macro', 'Tech & AI', 'Sports'];

  // Filtered & Sorted Markets
  const filteredMarkets = useMemo(() => {
    return markets
      .filter((m) => {
        const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
        const matchesSearch = 
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'volume') return b.volume24hUSD - a.volume24hUSD;
        if (sortBy === 'change') return Math.abs(b.change24h) - Math.abs(a.change24h);
        if (sortBy === 'probability') return b.probabilityYes - a.probabilityYes;
        return 0;
      });
  }, [markets, selectedCategory, searchQuery, sortBy]);

  // Quick Trade Handler
  const handleQuickTrade = (market: Market, outcome: OutcomeType, amount = 25) => {
    setSigningModalData({
      isOpen: true,
      market,
      outcome,
      amountUSDso: amount,
    });
  };

  // Transaction Confirmed Handler
  const handleTransactionSuccess = (receipt: TransactionReceipt) => {
    // Deduct balances
    setWallet((prev) => ({
      ...prev,
      usdsoBalance: Math.max(0, prev.usdsoBalance - receipt.totalCostUSDso),
      sttBalance: Math.max(0, prev.sttBalance - receipt.gasUsedSTT),
    }));

    // Add / Update Position
    const existingPosIndex = positions.findIndex(
      p => p.marketTitle === receipt.marketTitle && p.outcome === receipt.outcome
    );

    const pricePerShare = receipt.totalCostUSDso / receipt.shares;

    if (existingPosIndex >= 0) {
      const existing = positions[existingPosIndex];
      const newShares = existing.shares + receipt.shares;
      const newInvested = existing.totalInvested + receipt.totalCostUSDso;
      const newAvgPrice = newInvested / newShares;
      const updatedPositions = [...positions];
      updatedPositions[existingPosIndex] = {
        ...existing,
        shares: newShares,
        totalInvested: newInvested,
        avgBuyPrice: newAvgPrice,
        currentValue: newShares * existing.currentPrice,
        potentialPayout: newShares * 1.00,
        unrealizedPnL: (newShares * existing.currentPrice) - newInvested,
        unrealizedPnLPercent: (((newShares * existing.currentPrice) - newInvested) / newInvested) * 100,
      };
      setPositions(updatedPositions);
    } else {
      const newPos: UserPosition = {
        id: `pos-${Date.now()}`,
        marketId: signingModalData.market?.id || 'm-custom',
        marketTitle: receipt.marketTitle,
        outcome: receipt.outcome,
        shares: receipt.shares,
        avgBuyPrice: pricePerShare,
        currentPrice: pricePerShare,
        totalInvested: receipt.totalCostUSDso,
        currentValue: receipt.totalCostUSDso,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        potentialPayout: receipt.shares * 1.00,
        settlementDate: signingModalData.market?.settlementDate || 'Sep 2026',
        status: 'OPEN',
      };
      setPositions([newPos, ...positions]);
    }

    setTradeHistory([receipt, ...tradeHistory]);
  };

  const handleClaimTokens = (sttAmount: number, usdsoAmount: number) => {
    setWallet((prev) => ({
      ...prev,
      sttBalance: prev.sttBalance + sttAmount,
      usdsoBalance: prev.usdsoBalance + usdsoAmount,
    }));
  };

  const handleUpdateBalance = (amountDelta: number) => {
    setWallet(prev => ({
      ...prev,
      usdsoBalance: Math.max(0, prev.usdsoBalance + amountDelta)
    }));
  };

  const handleSelectMarketById = (marketId: string) => {
    const found = markets.find(m => m.id === marketId);
    if (found) {
      setDetailModalMarket(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onConnectWallet={() => {
          setWallet(prev => ({ ...prev, isConnected: !prev.isConnected }));
        }}
        onOpenFaucet={() => setFaucetOpen(true)}
        unreadAiSuggestions={2}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* VIEW: Market Radar */}
        {activeTab === 'radar' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Hero Quick Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Somnia Shannon Testnet • Web 4.0 Quantum Secured</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
                  Next-Gen Prediction Markets Powered by <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">QDS Event Contracts</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Trade discrete binary event outcomes with 100k+ TPS sub-second finality. Autonomous multi-model agentic reasoning, bonding curve token launchpad, Conway cellular volatility modeling, and post-quantum lattice security.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('agent_chat')}
                    id="btn-hero-agent-chat"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer transition-all active:scale-95"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Open Agentic Chatbot</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('launchpad')}
                    id="btn-hero-launchpad"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Rocket className="w-4 h-4 text-cyan-400" />
                    <span>Token Launchpad</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('conway')}
                    id="btn-hero-conway"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>Conway AI Automaton</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pqc')}
                    id="btn-hero-pqc"
                    className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>PQC Vault</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters, Search & View Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events or tags..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
                  />
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 text-slate-300 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="volume">Highest Volume</option>
                  <option value="change">24h Volatility</option>
                  <option value="probability">Top YES Odds</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Pro Table View"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Markets Content */}
            {filteredMarkets.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <p className="text-base font-semibold">No event contracts matched your filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    onSelectMarket={(m) => setDetailModalMarket(m)}
                    onQuickTrade={handleQuickTrade}
                    onAnalyzeAI={(m) => {
                      setDetailModalMarket(m);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Compact Pro Trading Table */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Event Market</th>
                        <th className="py-3 px-4">Sector</th>
                        <th className="py-3 px-4">YES Price (Prob)</th>
                        <th className="py-3 px-4">NO Price (Prob)</th>
                        <th className="py-3 px-4">24h Vol</th>
                        <th className="py-3 px-4">Settles</th>
                        <th className="py-3 px-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {filteredMarkets.map((market) => (
                        <tr key={market.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 max-w-sm">
                            <button
                              onClick={() => setDetailModalMarket(market)}
                              className="font-semibold text-slate-100 hover:text-cyan-300 text-left line-clamp-1 cursor-pointer transition-colors"
                            >
                              {market.title}
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                              {market.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                            ${market.yesPrice.toFixed(2)} ({market.probabilityYes}%)
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-rose-400">
                            ${market.noPrice.toFixed(2)} ({(100 - market.probabilityYes)}%)
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            ${(market.volume24hUSD / 1000).toFixed(1)}k
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {market.settlementDate}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleQuickTrade(market, 'YES')}
                                className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer transition-colors"
                              >
                                YES
                              </button>
                              <button
                                onClick={() => handleQuickTrade(market, 'NO')}
                                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer transition-colors"
                              >
                                NO
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW: Multi-Model Agentic Market Chatbot */}
        {activeTab === 'agent_chat' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AgenticChatbot
              markets={markets}
              selectedMarket={detailModalMarket}
              onSelectMarket={(m) => setDetailModalMarket(m)}
              onExecuteTrade={(marketId, outcome, amt) => {
                const targetMarket = markets.find(m => m.id === marketId);
                if (targetMarket) {
                  handleQuickTrade(targetMarket, outcome, amt);
                }
              }}
              onNavigateToTab={(tab) => setActiveTab(tab as NavTabType)}
              wallet={wallet}
            />
          </div>
        )}

        {/* VIEW: Token Launchpad */}
        {activeTab === 'launchpad' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <TokenLaunchpad
              wallet={wallet}
              onUpdateBalance={handleUpdateBalance}
              onNavigateToTab={(tab) => setActiveTab(tab as NavTabType)}
            />
          </div>
        )}

        {/* VIEW: Conway AI Automaton */}
        {activeTab === 'conway' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ConwayAutomaton />
          </div>
        )}

        {/* VIEW: Web 4.0 Post-Quantum Cryptography Vault */}
        {activeTab === 'pqc' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Web4PqcVault />
          </div>
        )}

        {/* VIEW: Portfolio */}
        {activeTab === 'portfolio' && (
          <PortfolioView
            positions={positions}
            tradeHistory={tradeHistory}
            onSelectMarketById={handleSelectMarketById}
          />
        )}

        {/* VIEW: Bot Kit Studio */}
        {activeTab === 'botkit' && (
          <BotKitStudio />
        )}

        {/* VIEW: Web3 Architecture Guide */}
        {activeTab === 'story' && (
          <Web3StoryGuide />
        )}

        {/* VIEW: Pitch Deck */}
        {activeTab === 'pitch' && (
          <HackathonPitchDeck />
        )}

      </main>

      {/* Market Detail Modal */}
      {detailModalMarket && (
        <MarketDetailModal
          market={detailModalMarket}
          onClose={() => setDetailModalMarket(null)}
          wallet={wallet}
          onInitiateTrade={(m, outcome, amt) => {
            setSigningModalData({
              isOpen: true,
              market: m,
              outcome,
              amountUSDso: amt,
            });
          }}
          onAskCopilot={(m) => {
            setActiveTab('agent_chat');
          }}
        />
      )}

      {/* Transaction Signing Modal */}
      <TransactionSigningModal
        isOpen={signingModalData.isOpen}
        onClose={() => setSigningModalData(prev => ({ ...prev, isOpen: false }))}
        market={signingModalData.market}
        outcome={signingModalData.outcome}
        amountUSDso={signingModalData.amountUSDso}
        wallet={wallet}
        onSuccess={handleTransactionSuccess}
      />

      {/* Faucet Modal */}
      <FaucetModal
        isOpen={faucetOpen}
        onClose={() => setFaucetOpen(false)}
        onClaimTokens={handleClaimTokens}
      />

      {/* Floating Action Button -> Direct Agentic Chatbot */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setActiveTab('agent_chat')}
          id="btn-floating-agent-chat"
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-2xl shadow-cyan-950/80 cursor-pointer border border-cyan-400/40 active:scale-95 transition-all"
        >
          <Bot className="w-4 h-4 text-slate-950 fill-current" />
          <span>Multi-Model Agent Chat</span>
        </button>
      </div>

    </div>
  );
}
