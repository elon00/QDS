import React, { useState } from 'react';
import { 
  Radio, 
  Wallet, 
  Flame, 
  Bot, 
  BookOpen, 
  Layers, 
  Trophy, 
  Droplet, 
  ChevronDown,
  Sparkles,
  Coins,
  Rocket,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { WalletState } from '../types';

export type NavTabType = 'radar' | 'agent_chat' | 'conway' | 'launchpad' | 'pqc' | 'portfolio' | 'botkit' | 'story' | 'pitch';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  wallet: WalletState;
  onConnectWallet: () => void;
  onOpenFaucet: () => void;
  unreadAiSuggestions: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onConnectWallet,
  onOpenFaucet,
  unreadAiSuggestions,
}) => {
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top network ticker bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800/80 px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Somnia Shannon Testnet
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-400">Chain ID: <span className="font-mono text-slate-300">50312</span></span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-slate-400">Sub-second Finality • 100k+ TPS EVM • Web 4.0 PQC Kyber-1024</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenFaucet}
            id="btn-nav-faucet"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Claim Test STT & USDso</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('radar')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-clip-text text-transparent">
                    QDS
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                    WEB 4.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none">
                  Quantitative Terminal on <span className="text-emerald-400 font-medium">Somnia L1</span>
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('radar')}
              id="tab-nav-radar"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Markets</span>
            </button>

            <button
              onClick={() => setActiveTab('agent_chat')}
              id="tab-nav-agent-chat"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'agent_chat'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Agentic Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('launchpad')}
              id="tab-nav-launchpad"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'launchpad'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Rocket className="w-3.5 h-3.5 text-indigo-400" />
              <span>Launchpad</span>
            </button>

            <button
              onClick={() => setActiveTab('conway')}
              id="tab-nav-conway"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'conway'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Conway AI</span>
            </button>

            <button
              onClick={() => setActiveTab('pqc')}
              id="tab-nav-pqc"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pqc'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-purple-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>PQC Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              id="tab-nav-portfolio"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('botkit')}
              id="tab-nav-botkit"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'botkit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bot Kit</span>
            </button>

            <button
              onClick={() => setActiveTab('story')}
              id="tab-nav-story"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              id="tab-nav-pitch"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pitch'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Pitch Deck</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Direct Agentic Chat Button */}
            <button
              onClick={() => setActiveTab('agent_chat')}
              id="btn-nav-agent-chat"
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-md shadow-cyan-950/40 cursor-pointer text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Agent Chat</span>
            </button>

            {/* Wallet Button */}
            {wallet.isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  id="btn-wallet-connected"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-100 text-xs font-mono transition-colors cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-xs text-slate-400 mb-2 font-medium">
                      Connected to Somnia Testnet
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-2 mb-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">STT Balance (Gas):</span>
                        <span className="font-mono text-emerald-400 font-semibold">{wallet.sttBalance.toFixed(3)} STT</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">USDso (Trading):</span>
                        <span className="font-mono text-indigo-400 font-semibold">${wallet.usdsoBalance.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onOpenFaucet();
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full mb-2 py-1.5 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Get Test Tokens</span>
                    </button>
                    <button
                      onClick={() => {
                        onConnectWallet();
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 text-center cursor-pointer"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                id="btn-connect-wallet"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="xl:hidden flex items-center overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'radar' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('agent_chat')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'agent_chat' ? 'bg-cyan-600 text-white' : 'text-cyan-400'
            }`}
          >
            Agent Chat
          </button>
          <button
            onClick={() => setActiveTab('launchpad')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'launchpad' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Launchpad
          </button>
          <button
            onClick={() => setActiveTab('conway')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'conway' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Conway AI
          </button>
          <button
            onClick={() => setActiveTab('pqc')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'pqc' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            PQC Vault
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'portfolio' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('botkit')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'botkit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Bot Kit
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'story' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'pitch' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
};
