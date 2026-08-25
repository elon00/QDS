import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  BarChart2,
  Users
} from 'lucide-react';
import { Market, OutcomeType } from '../types';

interface MarketCardProps {
  market: Market;
  onSelectMarket: (market: Market) => void;
  onQuickTrade: (market: Market, outcome: OutcomeType) => void;
  onAnalyzeAI: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  market,
  onSelectMarket,
  onQuickTrade,
  onAnalyzeAI,
}) => {
  const isPositive = market.change24h >= 0;

  return (
    <div 
      id={`card-market-${market.id}`}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 flex flex-col justify-between"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {market.category}
            </span>
            {market.featured && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className={`font-mono font-medium flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}{market.change24h}%
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectMarket(market)}
          className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer leading-snug mb-2"
        >
          {market.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {market.description}
        </p>

        {/* Probabilities Visualizer */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 mb-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              YES ${market.yesPrice.toFixed(2)} ({market.probabilityYes}%)
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              NO ${market.noPrice.toFixed(2)} ({(100 - market.probabilityYes)}%)
            </span>
          </div>

          {/* Bar track */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500" 
              style={{ width: `${market.probabilityYes}%` }}
            />
            <div 
              className="bg-gradient-to-r from-rose-400 to-pink-500 h-full transition-all duration-500" 
              style={{ width: `${100 - market.probabilityYes}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Vol: <span className="font-mono text-slate-200">${(market.volume24hUSD / 1000).toFixed(1)}k</span></span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-300 font-mono">{market.settlementDate}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onQuickTrade(market, 'YES')}
            id={`btn-buy-yes-${market.id}`}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Buy YES</span>
            <span className="font-mono text-slate-300">${market.yesPrice.toFixed(2)}</span>
          </button>

          <button
            onClick={() => onQuickTrade(market, 'NO')}
            id={`btn-buy-no-${market.id}`}
            className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Buy NO</span>
            <span className="font-mono text-slate-300">${market.noPrice.toFixed(2)}</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onAnalyzeAI(market)}
            id={`btn-ai-radar-${market.id}`}
            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Radar Analysis</span>
          </button>

          <button
            onClick={() => onSelectMarket(market)}
            id={`btn-view-market-${market.id}`}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer font-medium"
          >
            <span>View Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
