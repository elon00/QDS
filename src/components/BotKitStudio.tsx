import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  Pause, 
  Code2, 
  Plus, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Copy, 
  Check, 
  Terminal,
  Zap,
  Cpu,
  Sliders,
  Settings,
  ExternalLink,
  X
} from 'lucide-react';
import { BotStrategy, MarketCategory } from '../types';
import { INITIAL_BOT_STRATEGIES } from '../data/mockMarkets';

interface BotKitStudioProps {}

export const BotKitStudio: React.FC<BotKitStudioProps> = () => {
  const [strategies, setStrategies] = useState<BotStrategy[]>(INITIAL_BOT_STRATEGIES);
  const [selectedBot, setSelectedBot] = useState<BotStrategy>(INITIAL_BOT_STRATEGIES[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showNewBotModal, setShowNewBotModal] = useState(false);

  // New bot form state
  const [newBotName, setNewBotName] = useState('');
  const [newBotCategory, setNewBotCategory] = useState<MarketCategory>('Somnia');
  const [newBotAllocation, setNewBotAllocation] = useState(500);
  const [newBotStrategyType, setNewBotStrategyType] = useState<BotStrategy['strategyType']>('SENTIMENT_MOMENTUM');

  const toggleBotStatus = (botId: string) => {
    setStrategies(prev => prev.map(bot => {
      if (bot.id === botId) {
        const updated = { ...bot, active: !bot.active };
        if (selectedBot.id === botId) setSelectedBot(updated);
        return updated;
      }
      return bot;
    }));
  };

  const handleCreateBot = () => {
    if (!newBotName.trim()) return;

    const newBot: BotStrategy = {
      id: `bot-${Date.now()}`,
      name: newBotName,
      description: `Custom ${newBotStrategyType} automated agent deployed on Somnia L1.`,
      strategyType: newBotStrategyType,
      targetCategory: newBotCategory,
      minConfidence: 75,
      maxRisk: 'MEDIUM',
      allocationUSD: newBotAllocation,
      active: true,
      tradesExecuted: 0,
      totalProfitUSD: 0,
      winRate: 100,
      lastRun: 'Just now',
      codePreview: `import { QDSBot } from '@somnia-chain/qds-bot-kit';

const bot = new QDSBot({
  name: '${newBotName}',
  category: '${newBotCategory}',
  strategy: '${newBotStrategyType}',
  maxAllocationUSD: ${newBotAllocation},
  slippageLimit: 0.005,
});

bot.start();`,
    };

    setStrategies([newBot, ...strategies]);
    setSelectedBot(newBot);
    setShowNewBotModal(false);
    setNewBotName('');
  };

  const copyCode = () => {
    if (selectedBot.codePreview) {
      navigator.clipboard.writeText(selectedBot.codePreview);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                QDS Bot Kit & Autonomous Trading Agents
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Deploy algorithmic prediction market agents and automated market makers on Somnia L1 using the QDS Bot Kit SDK with sub-second execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewBotModal(true)}
              id="btn-create-bot"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/50 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy New Bot Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Bots List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Active Bot Agents ({strategies.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Somnia EVM Network</span>
          </div>

          <div className="space-y-3">
            {strategies.map((bot) => (
              <div
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedBot.id === bot.id
                    ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{bot.name}</h4>
                    <span className="text-[11px] text-slate-400">{bot.targetCategory} Markets</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBotStatus(bot.id);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      bot.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {bot.active ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
                    <span>{bot.active ? 'RUNNING' : 'PAUSED'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {bot.description}
                </p>

                {/* Bot Telemetry Row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Trades</span>
                    <span className="font-bold text-slate-200">{bot.tradesExecuted}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Win Rate</span>
                    <span className="font-bold text-emerald-400">{bot.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Net PnL</span>
                    <span className="font-bold text-emerald-400">+${bot.totalProfitUSD.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Bot Inspector & Code Exporter (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedBot.strategyType}
                </span>
                <span className="text-xs text-slate-400">Last active: {selectedBot.lastRun}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1">
                {selectedBot.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Bot Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Allocation Limit</span>
              <span className="text-sm font-bold font-mono text-slate-100">${selectedBot.allocationUSD} USDso</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Min AI Confidence</span>
              <span className="text-sm font-bold font-mono text-purple-300">{selectedBot.minConfidence}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Max Allowed Risk</span>
              <span className="text-sm font-bold font-mono text-amber-300">{selectedBot.maxRisk}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Execution Chain</span>
              <span className="text-sm font-bold font-mono text-emerald-400">Somnia Testnet</span>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-indigo-400">
                <Code2 className="w-4 h-4" /> TypeScript Implementation (QDS Bot Kit)
              </span>
              <span className="text-[11px]">Node.js / Bun Runtime</span>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-[11px] leading-relaxed text-indigo-200">
                {selectedBot.codePreview || `// Deploying bot on Somnia L1...`}
              </pre>
            </div>
          </div>

          {/* Hackathon Bot Kit integration guidance */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              Developer Integration Note
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This code sample is compatible with the official <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">somnia-chain/qds-bot-kit</code> repository. You can clone the bot kit repository, insert your Somnia testnet private key with test STT, and run these autonomous agents natively on Somnia EVM.
            </p>
          </div>
        </div>

      </div>

      {/* New Bot Modal */}
      {showNewBotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <span>Deploy New QDS Trading Agent</span>
              </h3>
              <button onClick={() => setShowNewBotModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bot Agent Name:</label>
                <input
                  type="text"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="e.g. Somnia Fast Rebalancer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Strategy Pattern:</label>
                <select
                  value={newBotStrategyType}
                  onChange={(e) => setNewBotStrategyType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="SENTIMENT_MOMENTUM">AI Sentiment Momentum Agent</option>
                  <option value="ARBITRAGE_REBALANCER">Cross-Market Arbitrage & Spread Rebalancer</option>
                  <option value="ORACLE_HEDGER">Oracle Resolution Delta Hedger</option>
                  <option value="VOLATILITY_SNIPER">Pre-Event Volatility Sniper</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Sector:</label>
                  <select
                    value={newBotCategory}
                    onChange={(e) => setNewBotCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="Somnia">Somnia Ecosystem</option>
                    <option value="Crypto">Crypto Assets</option>
                    <option value="Macro">Macro & Rates</option>
                    <option value="Tech & AI">Tech & AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">USDso Allocation:</label>
                  <input
                    type="number"
                    value={newBotAllocation}
                    onChange={(e) => setNewBotAllocation(parseInt(e.target.value) || 100)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCreateBot}
                disabled={!newBotName.trim()}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Deploy Bot to Somnia Testnet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
