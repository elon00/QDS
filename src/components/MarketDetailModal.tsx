import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Info, 
  Zap, 
  ArrowRight,
  Copy,
  Check,
  BarChart2,
  Lock,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Market, OutcomeType, AIAnalysis, WalletState } from '../types';

interface MarketDetailModalProps {
  market: Market | null;
  onClose: () => void;
  wallet: WalletState;
  onInitiateTrade: (market: Market, outcome: OutcomeType, amountUSDso: number) => void;
  onAskCopilot: (market: Market) => void;
}

export const MarketDetailModal: React.FC<MarketDetailModalProps> = ({
  market,
  onClose,
  wallet,
  onInitiateTrade,
  onAskCopilot,
}) => {
  if (!market) return null;

  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType>('YES');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [tradeAmountUSD, setTradeAmountUSD] = useState<number>(25);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [copiedContract, setCopiedContract] = useState(false);
  const [activeChartTimeframe, setActiveChartTimeframe] = useState<'1D' | '1W' | 'ALL'>('1D');
  
  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fetch AI deep analysis for this market
  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      setIsLoadingAi(true);
      setAiError(null);
      try {
        const res = await fetch('/api/ai/analyze-market', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market }),
        });
        if (!res.ok) throw new Error('AI analysis service unavailable');
        const data = await res.json();
        if (isMounted && data.analysis) {
          setAiAnalysis(data.analysis);
        }
      } catch (err: any) {
        if (isMounted) {
          setAiError(err.message || 'Could not fetch AI analysis');
        }
      } finally {
        if (isMounted) setIsLoadingAi(false);
      }
    };

    fetchAnalysis();
    return () => {
      isMounted = false;
    };
  }, [market.id]);

  const currentPrice = selectedOutcome === 'YES' ? market.yesPrice : market.noPrice;
  const estimatedShares = tradeAmountUSD > 0 && currentPrice > 0 ? tradeAmountUSD / currentPrice : 0;
  const potentialPayout = estimatedShares * 1.00; // Each share pays $1.00 if won
  const potentialProfit = Math.max(0, potentialPayout - tradeAmountUSD);
  const returnMultiplier = tradeAmountUSD > 0 ? (potentialPayout / tradeAmountUSD).toFixed(2) : '0';
  const roiPercent = tradeAmountUSD > 0 ? ((potentialProfit / tradeAmountUSD) * 100).toFixed(1) : '0';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  // SVG Chart calculation
  const history = market.priceHistory;
  const minPrice = 0;
  const maxPrice = 1;
  const svgWidth = 500;
  const svgHeight = 160;

  const points = history.map((pt, index) => {
    const x = (index / (history.length - 1)) * (svgWidth - 40) + 20;
    const price = selectedOutcome === 'YES' ? pt.yesPrice : pt.noPrice;
    const y = svgHeight - 30 - ((price - minPrice) / (maxPrice - minPrice)) * (svgHeight - 60);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div 
        id="modal-market-terminal"
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {market.category}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Settles: {market.settlementDate}
            </span>
          </div>

          <button
            onClick={onClose}
            id="btn-close-modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Market Specs, Chart, AI Intelligence, Resolution (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 leading-snug mb-2">
                {market.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {market.description}
              </p>
            </div>

            {/* Price Chart Card */}
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedOutcome} Probability Trajectory
                  </span>
                  <span className={`text-xs font-mono font-bold ${selectedOutcome === 'YES' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${currentPrice.toFixed(2)} ({Math.round(currentPrice * 100)}%)
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                  {(['1D', '1W', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setActiveChartTimeframe(tf)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        activeChartTimeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Area Chart */}
              <div className="w-full h-40 relative flex items-center justify-center">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="yesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="noGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal gridlines */}
                  <line x1="20" y1="30" x2={svgWidth - 20} y2="30" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="20" y1="80" x2={svgWidth - 20} y2="80" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />
                  <line x1="20" y1="130" x2={svgWidth - 20} y2="130" stroke="#334155" strokeDasharray="3,3" strokeWidth="0.8" />

                  {/* Chart line */}
                  <polyline
                    fill="none"
                    stroke={selectedOutcome === 'YES' ? '#10b981' : '#f43f5e'}
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data dots */}
                  {history.map((pt, i) => {
                    const x = (i / (history.length - 1)) * (svgWidth - 40) + 20;
                    const price = selectedOutcome === 'YES' ? pt.yesPrice : pt.noPrice;
                    const y = svgHeight - 30 - ((price - minPrice) / (maxPrice - minPrice)) * (svgHeight - 60);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4" fill={selectedOutcome === 'YES' ? '#10b981' : '#f43f5e'} className="hover:scale-150 transition-transform" />
                        <text x={x} y={svgHeight - 6} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {pt.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* AI Radar Intelligence Card */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-950/80 rounded-xl border border-purple-500/30 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      AI Copilot Probability & Risk Matrix
                    </h4>
                    <p className="text-[11px] text-purple-300">
                      Powered by Gemini 3.7 Flash & Somnia Oracles
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAskCopilot(market)}
                  id="btn-modal-ask-copilot"
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold border border-purple-500/40 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  <span>Consult Copilot</span>
                </button>
              </div>

              {isLoadingAi ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-purple-300 font-medium animate-pulse">
                    Evaluating on-chain orderbook & catalyst distribution...
                  </p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-3 text-xs">
                  {/* Probability Comparison Row */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-purple-900/40">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Implied Market Odds</span>
                      <span className="text-sm font-bold font-mono text-slate-200">{aiAnalysis.impliedProb}%</span>
                    </div>
                    <div>
                      <span className="text-purple-300 block text-[10px] uppercase font-medium">AI Fair Probability</span>
                      <span className="text-sm font-bold font-mono text-purple-300">{aiAnalysis.aiEstimatedProb}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-medium">Alpha Edge / Bias</span>
                      <span className={`text-sm font-bold font-mono ${aiAnalysis.edgePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {aiAnalysis.edgePercent >= 0 ? '+' : ''}{aiAnalysis.edgePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Recommendation & Risk */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Rating:</span>
                      <span className="px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {aiAnalysis.recommendation.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Risk:</span>
                      <span className={`px-2 py-0.5 rounded font-semibold border ${
                        aiAnalysis.riskScore === 'LOW' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        aiAnalysis.riskScore === 'MEDIUM' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}>
                        {aiAnalysis.riskScore} RISK
                      </span>
                    </div>
                  </div>

                  {/* Explainability Summary */}
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                    <span className="font-semibold text-purple-300 block mb-1">
                      AI Probabilistic Thesis:
                    </span>
                    <p className="text-xs text-slate-300">
                      {aiAnalysis.explainabilitySummary}
                    </p>
                  </div>

                  {/* Bull & Bear Drivers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-200">
                      <strong className="block text-emerald-400 mb-0.5">Bullish Drivers:</strong>
                      {aiAnalysis.bullCase}
                    </div>
                    <div className="p-2 rounded bg-rose-950/30 border border-rose-900/40 text-rose-200">
                      <strong className="block text-rose-400 mb-0.5">Risk Drivers:</strong>
                      {aiAnalysis.bearCase}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  {aiError || 'AI Copilot is standing by to evaluate this contract.'}
                </p>
              )}
            </div>

            {/* Resolution Criteria & Smart Contract details */}
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Oracle Verification & Resolution Specs
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Oracle Resolution Engine:</span>
                  <span className="font-medium text-slate-200">{market.oracleSource}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contract Address (Somnia L1):</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-indigo-300">{market.contractAddress.slice(0, 10)}...{market.contractAddress.slice(-8)}</span>
                    <button
                      onClick={() => copyToClipboard(market.contractAddress)}
                      className="p-1 text-slate-400 hover:text-slate-100 cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-300 block mb-0.5">Resolution Rule:</strong>
                {market.resolutionCriteria}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Trading Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-base text-slate-100">
                  Trade Event Contract
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  QDS AMM
                </span>
              </div>

              {/* Outcome Selection Buttons (YES / NO) */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Choose Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedOutcome('YES')}
                    id="btn-select-yes"
                    className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      selectedOutcome === 'YES'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/60 scale-[1.02]'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                      YES
                    </span>
                    <span className="font-mono text-xs opacity-90">${market.yesPrice.toFixed(2)} ({market.probabilityYes}%)</span>
                  </button>

                  <button
                    onClick={() => setSelectedOutcome('NO')}
                    id="btn-select-no"
                    className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      selectedOutcome === 'NO'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950/60 scale-[1.02]'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-rose-500/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-300"></span>
                      NO
                    </span>
                    <span className="font-mono text-xs opacity-90">${market.noPrice.toFixed(2)} ({(100 - market.probabilityYes)}%)</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="font-semibold text-slate-400">
                    Amount (USDso):
                  </label>
                  <span className="text-slate-400 font-mono">
                    Balance: <span className="text-indigo-300 font-semibold">${wallet.usdsoBalance.toFixed(2)}</span>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={tradeAmountUSD || ''}
                    onChange={(e) => setTradeAmountUSD(Math.max(0, parseFloat(e.target.value) || 0))}
                    id="input-trade-amount"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-8 pr-16 text-slate-100 font-mono font-semibold focus:outline-none focus:border-indigo-500"
                    placeholder="25.00"
                  />
                  <button
                    onClick={() => setTradeAmountUSD(wallet.usdsoBalance)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTradeAmountUSD(amt)}
                      className={`py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        tradeAmountUSD === amt ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Payout Breakdown Box */}
              <div className="mt-5 bg-slate-900/90 rounded-xl border border-slate-800/80 p-3.5 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Shares:</span>
                  <span className="font-mono text-slate-200 font-semibold">{estimatedShares.toFixed(2)} Shares</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg Price per Share:</span>
                  <span className="font-mono text-slate-200">${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Potential Payout:</span>
                  <span className="font-mono text-emerald-400 font-bold">${potentialPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-medium">
                  <span className="text-slate-300">Expected Profit / ROI:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +${potentialProfit.toFixed(2)} (+{roiPercent}%)
                  </span>
                </div>
              </div>

              {/* Gas & Slippage */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Gas: <span className="font-mono text-slate-300">~0.00038 STT</span>
                </span>
                <span className="flex items-center gap-1">
                  Slippage:
                  <select
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="bg-slate-900 text-slate-200 text-[11px] rounded px-1 py-0.5 border border-slate-700"
                  >
                    <option value={0.5}>0.5%</option>
                    <option value={1.0}>1.0%</option>
                    <option value={2.0}>2.0%</option>
                  </select>
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div>
              {wallet.usdsoBalance < tradeAmountUSD && (
                <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Low USDso balance. Claim free testnet tokens from the faucet.</span>
                </div>
              )}

              <button
                onClick={() => onInitiateTrade(market, selectedOutcome, tradeAmountUSD)}
                disabled={tradeAmountUSD <= 0 || wallet.usdsoBalance < tradeAmountUSD}
                id="btn-place-order"
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  selectedOutcome === 'YES'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>
                  Confirm & Buy {selectedOutcome} Shares (${tradeAmountUSD})
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-500 mt-2">
                Simulated on-chain contract execution on Somnia Testnet
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
