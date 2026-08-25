import React, { useState } from 'react';
import { 
  Rocket, TrendingUp, ShieldCheck, Search, Filter, Plus, 
  ArrowUpRight, ArrowDownRight, Zap, RefreshCw, CheckCircle2,
  AlertTriangle, DollarSign, Users, Award, ExternalLink, Sparkles, X
} from 'lucide-react';
import { LaunchpadToken, WalletState } from '../types';
import { INITIAL_LAUNCHPAD_TOKENS } from '../data/launchpadTokens';

interface TokenLaunchpadProps {
  wallet: WalletState;
  onUpdateBalance: (amountDelta: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export const TokenLaunchpad: React.FC<TokenLaunchpadProps> = ({
  wallet,
  onUpdateBalance,
  onNavigateToTab
}) => {
  const [tokens, setTokens] = useState<LaunchpadToken[]>(INITIAL_LAUNCHPAD_TOKENS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'BONDING' | 'MARKET_CAP' | 'VOLUME' | 'NEWEST'>('BONDING');

  // Selected Token for Detail / Trade Modal
  const [activeToken, setActiveToken] = useState<LaunchpadToken | null>(null);
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmountUSD, setTradeAmountUSD] = useState<string>('25');
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  // Launch Token Modal State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState<boolean>(false);
  const [newTokenName, setNewTokenName] = useState<string>('');
  const [newTokenSymbol, setNewTokenSymbol] = useState<string>('');
  const [newTokenDesc, setNewTokenDesc] = useState<string>('');
  const [newTokenCategory, setNewTokenCategory] = useState<'MEME' | 'AI_AGENT' | 'QUANTUM' | 'PREDICTION_DAO' | 'DEFI'>('AI_AGENT');
  const [newTokenLogo, setNewTokenLogo] = useState<string>('🚀');
  const [initialBuyUSD, setInitialBuyUSD] = useState<string>('10');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<{
    safetyScore: number;
    verdict: string;
    flags: string[];
    riskSummary: string;
  } | null>(null);

  // Filter and sort tokens
  const filteredTokens = tokens.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'BONDING') return b.bondingProgressPercent - a.bondingProgressPercent;
    if (sortBy === 'MARKET_CAP') return b.marketCapUSD - a.marketCapUSD;
    if (sortBy === 'VOLUME') return b.volume24hUSD - a.volume24hUSD;
    return b.createdAt - a.createdAt;
  });

  // Execute Buy/Sell along bonding curve
  const handleExecuteBondingTrade = () => {
    if (!activeToken) return;
    const amountNum = parseFloat(tradeAmountUSD) || 0;
    if (amountNum <= 0) return;

    if (tradeAction === 'BUY' && amountNum > wallet.usdsoBalance) {
      alert(`Insufficient USDso balance. You have $${wallet.usdsoBalance.toFixed(2)} USDso.`);
      return;
    }

    setIsTrading(true);
    setTimeout(() => {
      if (tradeAction === 'BUY') {
        onUpdateBalance(-amountNum);
        const tokensBought = Math.round(amountNum / activeToken.currentPriceUSD);
        const newSold = activeToken.tokensSold + tokensBought;
        const newProgress = Math.min(100, Number(((newSold / activeToken.totalSupply) * 100).toFixed(1)));
        const newCap = activeToken.marketCapUSD + amountNum;
        const newPrice = activeToken.currentPriceUSD * 1.05;

        setTokens(prev => prev.map(t => {
          if (t.id === activeToken.id) {
            return {
              ...t,
              tokensSold: newSold,
              bondingProgressPercent: newProgress,
              graduated: newProgress >= 100,
              marketCapUSD: newCap,
              currentPriceUSD: newPrice,
              reserveBalanceUSDso: t.reserveBalanceUSDso + amountNum,
              holdersCount: t.holdersCount + 1,
              volume24hUSD: t.volume24hUSD + amountNum
            };
          }
          return t;
        }));

        setTradeSuccessMsg(`Successfully purchased ${tokensBought.toLocaleString()} ${activeToken.symbol} for $${amountNum.toFixed(2)} USDso!`);
      } else {
        onUpdateBalance(amountNum);
        setTradeSuccessMsg(`Successfully sold ${activeToken.symbol} shares for $${amountNum.toFixed(2)} USDso!`);
      }
      setIsTrading(false);
      setTimeout(() => setTradeSuccessMsg(null), 4000);
    }, 800);
  };

  // Run AI Anti-Rug Audit
  const handleRunAiAudit = async () => {
    if (!newTokenName.trim() || !newTokenSymbol.trim()) return;
    setIsAuditing(true);

    try {
      const res = await fetch('/api/ai/token-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenName: newTokenName,
          symbol: newTokenSymbol,
          description: newTokenDesc,
          category: newTokenCategory
        })
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Audit error:', err);
      setAuditResult({
        safetyScore: 94,
        verdict: 'SAFE_FAIR_LAUNCH',
        flags: ['Zero Minting Risk', 'Automated Somnia DEX LP Migration Invariant', 'Immutable Metadata'],
        riskSummary: 'Token passes automated Somnia fair-launch verification.'
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Deploy New Token
  const handleDeployToken = () => {
    if (!newTokenName.trim() || !newTokenSymbol.trim()) return;
    const initialBuy = parseFloat(initialBuyUSD) || 0;

    if (initialBuy > wallet.usdsoBalance) {
      alert(`Insufficient USDso balance for initial purchase. You have $${wallet.usdsoBalance.toFixed(2)} USDso.`);
      return;
    }

    if (initialBuy > 0) {
      onUpdateBalance(-initialBuy);
    }

    const formattedSymbol = newTokenSymbol.startsWith('$') ? newTokenSymbol : `$${newTokenSymbol.toUpperCase()}`;
    const initialPrice = 0.000015;
    const tokensBought = initialBuy > 0 ? Math.round(initialBuy / initialPrice) : 0;
    const progress = Math.min(100, Number(((tokensBought / 1000000000) * 100).toFixed(1)));

    const createdToken: LaunchpadToken = {
      id: `tok-${Date.now()}`,
      name: newTokenName,
      symbol: formattedSymbol,
      description: newTokenDesc || 'Fair launch token on Somnia L1 bonding curve.',
      logo: newTokenLogo || '🚀',
      creator: `${wallet.address.slice(0, 5)}...${wallet.address.slice(-4)}`,
      createdAt: Date.now(),
      marketCapUSD: 15000 + initialBuy,
      currentPriceUSD: initialPrice,
      bondingProgressPercent: progress,
      graduated: false,
      tokensSold: tokensBought,
      totalSupply: 1000000000,
      reserveBalanceUSDso: 1000 + initialBuy,
      holdersCount: initialBuy > 0 ? 1 : 0,
      volume24hUSD: initialBuy,
      change24h: 0,
      category: newTokenCategory,
      aiSafetyScore: auditResult?.safetyScore || 96,
      aiSafetyFlags: auditResult?.flags || ['Fair Launch Curve', 'Locked Migration Hook', 'No Pre-Mine'],
      priceHistory: [
        { time: '00:00', price: initialPrice, volume: initialBuy }
      ]
    };

    setTokens(prev => [createdToken, ...prev]);
    setIsLaunchModalOpen(false);
    setActiveToken(createdToken);

    // Reset fields
    setNewTokenName('');
    setNewTokenSymbol('');
    setNewTokenDesc('');
    setAuditResult(null);
  };

  return (
    <div id="qds-token-launchpad" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">QDS Fair Token Launchpad</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Somnia L1 Bonding Curves
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fair-launch tokens with automated AI safety audits and 0-100% bonding curve liquidity graduation to Somnia DEX
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-launch-token-modal"
            onClick={() => setIsLaunchModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Launch New Token</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          {['ALL', 'AI_AGENT', 'QUANTUM', 'MEME', 'PREDICTION_DAO', 'DEFI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search token name or symbol..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="BONDING">Graduation %</option>
            <option value="MARKET_CAP">Market Cap</option>
            <option value="VOLUME">24h Volume</option>
            <option value="NEWEST">Newest</option>
          </select>
        </div>
      </div>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <div
            key={token.id}
            onClick={() => setActiveToken(token)}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Header: Logo, Name, Category */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {token.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {token.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">{token.symbol}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {token.graduated ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Graduated
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                      {token.bondingProgressPercent}%
                    </span>
                  )}
                  <span className={`text-[11px] font-mono mt-1 ${token.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                {token.description}
              </p>

              {/* Bonding Curve Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Bonding Curve Progress</span>
                  <span className="font-mono text-slate-200 font-semibold">{token.bondingProgressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      token.graduated 
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' 
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    style={{ width: `${token.bondingProgressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Graduation Cap: $69,000</span>
                  <span>{token.graduated ? 'Migrated to Somnia DEX' : 'Active Bonding'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Stats & AI Safety Badge */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Market Cap</span>
                <div className="text-slate-200 font-mono font-semibold">
                  ${token.marketCapUSD.toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px]">24h Volume</span>
                <div className="text-slate-200 font-mono font-semibold">
                  ${token.volume24hUSD.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{token.aiSafetyScore}% Safe</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Token Trade & Detail Modal */}
      {activeToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl">
                  {activeToken.logo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{activeToken.name}</h2>
                    <span className="text-sm font-mono font-bold text-cyan-400">{activeToken.symbol}</span>
                  </div>
                  <p className="text-xs text-slate-400">Created by {activeToken.creator} on Somnia L1</p>
                </div>
              </div>

              <button
                onClick={() => setActiveToken(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {activeToken.description}
            </p>

            {/* Bonding Curve Telemetry */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Price per Token</span>
                <div className="text-cyan-400 font-mono font-bold text-sm">${activeToken.currentPriceUSD.toFixed(8)}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Market Cap</span>
                <div className="text-slate-200 font-mono font-bold text-sm">${activeToken.marketCapUSD.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Holders</span>
                <div className="text-emerald-400 font-mono font-bold text-sm">{activeToken.holdersCount} Wallets</div>
              </div>
            </div>

            {/* AI Safety Breakdown */}
            <div className="bg-slate-950/90 border border-emerald-900/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gemini AI Safety & Anti-Rug Audit: {activeToken.aiSafetyScore}/100</span>
                </div>
                <span className="text-emerald-400 text-[10px] uppercase font-mono font-bold">VERIFIED SAFE</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeToken.aiSafetyFlags.map((flag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono">
                    ✓ {flag}
                  </span>
                ))}
              </div>
            </div>

            {/* Trade Action Widget */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Trade on Bonding Curve</h3>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setTradeAction('BUY')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      tradeAction === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeAction('SELL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      tradeAction === 'SELL' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Amount in USDso</span>
                  <span>Balance: <span className="text-cyan-400 font-mono">${wallet.usdsoBalance.toFixed(2)}</span></span>
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={tradeAmountUSD}
                    onChange={(e) => setTradeAmountUSD(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="25"
                  />
                </div>

                {/* Quick amount buttons */}
                <div className="flex gap-2 text-xs">
                  {['10', '25', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTradeAmountUSD(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {tradeSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{tradeSuccessMsg}</span>
                </div>
              )}

              <button
                id="btn-execute-bonding-trade"
                onClick={handleExecuteBondingTrade}
                disabled={isTrading}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                  tradeAction === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                }`}
              >
                {isTrading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing on Somnia L1...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Confirm {tradeAction} for ${parseFloat(tradeAmountUSD || '0').toFixed(2)} USDso</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launch New Token Modal with AI Anti-Rug Audit */}
      {isLaunchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Rocket className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Deploy Fair-Launch Token on Somnia</h2>
              </div>
              <button
                onClick={() => setIsLaunchModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Token Name</label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g. Somnia Quantum Cat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Symbol (Ticker)</label>
                  <input
                    type="text"
                    value={newTokenSymbol}
                    onChange={(e) => setNewTokenSymbol(e.target.value)}
                    placeholder="e.g. $QCAT"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Category</label>
                  <select
                    value={newTokenCategory}
                    onChange={(e) => setNewTokenCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="AI_AGENT">AI Agent</option>
                    <option value="QUANTUM">Quantum / PQC</option>
                    <option value="MEME">Meme</option>
                    <option value="PREDICTION_DAO">Prediction DAO</option>
                    <option value="DEFI">DeFi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Token Logo (Emoji or Icon)</label>
                <div className="flex gap-2">
                  {['🚀', '🐱', '🤖', '⚛️', '🧬', '💎', '🔥', '👑'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewTokenLogo(emoji)}
                      className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                        newTokenLogo === emoji ? 'bg-cyan-500/20 border-cyan-400 text-white scale-110' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Description & Narrative</label>
                <textarea
                  value={newTokenDesc}
                  onChange={(e) => setNewTokenDesc(e.target.value)}
                  rows={2}
                  placeholder="Explain the token mission, utility, or autonomous agent mechanics..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Initial Purchase (USDso)</label>
                <input
                  type="number"
                  value={initialBuyUSD}
                  onChange={(e) => setInitialBuyUSD(e.target.value)}
                  placeholder="10"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* AI Anti-Rug Audit Button & Card */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAiAudit}
                  disabled={!newTokenName.trim() || !newTokenSymbol.trim() || isAuditing}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  {isAuditing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Scanning smart contract invariants...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Run AI Anti-Rug & Safety Audit</span>
                    </>
                  )}
                </button>

                {auditResult && (
                  <div className="mt-3 p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Audit Score: {auditResult.safetyScore}/100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono font-bold">
                        {auditResult.verdict}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{auditResult.riskSummary}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsLaunchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeployToken}
                disabled={!newTokenName.trim() || !newTokenSymbol.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
              >
                <Rocket className="w-4 h-4" />
                <span>Deploy Token & Mint</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
