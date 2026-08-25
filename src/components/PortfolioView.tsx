import React from 'react';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { UserPosition, TransactionReceipt, Market } from '../types';

interface PortfolioViewProps {
  positions: UserPosition[];
  tradeHistory: TransactionReceipt[];
  onSelectMarketById: (marketId: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  positions,
  tradeHistory,
  onSelectMarketById,
}) => {
  const totalInvested = positions.reduce((acc, pos) => acc + pos.totalInvested, 0);
  const totalValue = positions.reduce((acc, pos) => acc + pos.currentValue, 0);
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const totalPotentialPayout = positions.reduce((acc, pos) => acc + pos.potentialPayout, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Portfolio Overview Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              QDS Event Portfolio Value
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-slate-100">
                ${totalValue.toFixed(2)} USDso
              </span>
              <span className={`text-sm font-bold font-mono flex items-center gap-1 ${
                totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {totalPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({totalPnLPercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-0.5">Total Invested:</span>
              <span className="font-mono font-bold text-slate-200">${totalInvested.toFixed(2)}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-0.5">Max Potential Payout:</span>
              <span className="font-mono font-bold text-emerald-400">${totalPotentialPayout.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Active Positions</span>
            <span className="text-lg font-bold font-mono text-slate-100">{positions.length}</span>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Settled / Claimable</span>
            <span className="text-lg font-bold font-mono text-emerald-400">0</span>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">On-Chain Gas Paid</span>
            <span className="text-lg font-bold font-mono text-slate-300">0.0012 STT</span>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Execution Speed</span>
            <span className="text-lg font-bold font-mono text-indigo-400">&lt; 0.5s (Somnia)</span>
          </div>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Active Prediction Positions</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {positions.length} Open Contracts
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <p>No active positions yet.</p>
            <p className="text-xs text-slate-500">
              Explore markets from the radar and place your first event trade.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Market</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Shares</th>
                  <th className="py-3 px-4">Avg Price</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Invested</th>
                  <th className="py-3 px-4">Current Value</th>
                  <th className="py-3 px-4">Unrealized PnL</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {positions.map((pos) => {
                  const isPnLPositive = pos.unrealizedPnL >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <button
                          onClick={() => onSelectMarketById(pos.marketId)}
                          className="font-semibold text-slate-100 hover:text-indigo-300 transition-colors text-left line-clamp-1 cursor-pointer"
                        >
                          {pos.marketTitle}
                        </button>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Settles: {pos.settlementDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          pos.outcome === 'YES' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {pos.outcome}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">{pos.shares.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">${pos.avgBuyPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">${pos.currentPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono">${pos.totalInvested.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-100">${pos.currentValue.toFixed(2)}</td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={`font-bold ${isPnLPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPnLPositive ? '+' : ''}${pos.unrealizedPnL.toFixed(2)} ({pos.unrealizedPnLPercent.toFixed(1)}%)
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectMarketById(pos.marketId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* On-Chain Transaction Activity */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Somnia On-Chain Transaction Telemetry</span>
        </h3>

        {tradeHistory.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No recent transactions recorded in this session.</p>
        ) : (
          <div className="space-y-2">
            {tradeHistory.map((tx, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div>
                    <span className="text-slate-200 font-sans font-medium block">
                      Bought {tx.shares.toFixed(2)} {tx.outcome} on "{tx.marketTitle.slice(0, 35)}..."
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Block #{tx.blockNumber} • Gas: {tx.gasUsedSTT} STT • {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-200 font-bold block">${tx.totalCostUSDso.toFixed(2)} USDso</span>
                  <span className="text-[10px] text-indigo-400 truncate max-w-[120px] inline-block">
                    {tx.txHash.slice(0, 10)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
