import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  HelpCircle,
  Globe,
  Radio
} from 'lucide-react';

interface Web3StoryGuideProps {}

export const Web3StoryGuide: React.FC<Web3StoryGuideProps> = () => {
  const [activeStoryChapter, setActiveStoryChapter] = useState<number>(0);

  const chapters = [
    {
      title: '1. What makes this a True Web3 Project?',
      subtitle: 'Understanding Decentralized Prediction Markets on EVM',
      content: `
**Web2 vs Web3 Architectural Comparison:**
- **Web2 Apps (Centralized):** Your funds sit in a private database. Settlement is opaque, withdrawals can be restricted, and counterparty risk is high.
- **Web3 Apps (QDS on Somnia):** Trades, shares, and collateral are held directly by **Event Smart Contracts**. Resolution is trustlessly verified by decentralized price oracles (Pyth/Chainlink) and payouts occur mathematically without middlemen.
      `,
      diagramType: 'web2_vs_web3',
    },
    {
      title: '2. Why Somnia Layer 1 is the Ultimate Engine',
      subtitle: '100,000+ TPS EVM with Sub-Second Finality',
      content: `
Legacy blockchains struggle with high gas fees and slow block times.
**Somnia L1 Architecture:**
- **Throughput:** Exceeds 100,000 Transactions Per Second (TPS).
- **Execution:** Full EVM bytecode compatibility with microsecond state transitions.
- **Cost:** Sub-cent gas fees paid in native **STT** tokens.
This enables high-frequency orderbook matching and autonomous bot execution without congestion.
      `,
      diagramType: 'somnia_speed',
    },
    {
      title: '3. How QDS Event Contracts Work',
      subtitle: 'Binary Outcome Pricing and Mathematical Settlement',
      content: `
Consider an event: **"Will BTC trade above $120,000 before Sept 30, 2026?"**
- If the market prices a 64% likelihood, **YES tokens trade at $0.64** and **NO tokens trade at $0.36**.
- The binary invariant is always **YES + NO = $1.00 USDso**.
- Upon expiration, the verified Oracle resolves the contract. Winning shares redeem at **$1.00 each**, while losing shares expire to $0.00.
      `,
      diagramType: 'event_contract_flow',
    },
    {
      title: '4. The AI Copilot & Autonomous Agent Layer',
      subtitle: 'Explainable Probability Models + Non-Custodial Safety',
      content: `
We designed the AI Copilot with strict non-custodial safety:
1. **Market Scanner:** Gemini 3.7 synthesizes orderbook depth, sentiment, and macro catalysts.
2. **Explainability Engine:** Delivers full probabilistic reasoning and risk scores rather than blind guesses.
3. **User Approval (EIP-712):** User retains complete control and manually signs the transaction in their wallet.
4. **QDS Bot Kit:** Developers can automate strategies with open-source TypeScript SDK scripts.
      `,
      diagramType: 'ai_copilot_safety',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Web3 & Hackathon Story Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          The Somnia × QDS Architecture Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          A comprehensive visual walkthrough of Event Contracts, Somnia 100k TPS EVM, Oracle settlement, and non-custodial AI copilots.
        </p>
      </div>

      {/* Chapter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {chapters.map((ch, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStoryChapter(idx)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeStoryChapter === idx
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-mono block text-slate-500 mb-1">CHAPTER 0{idx + 1}</span>
            <span className="text-xs font-bold line-clamp-1">{ch.title.split(':')[1] || ch.title}</span>
          </button>
        ))}
      </div>

      {/* Active Chapter Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Chapter 0{activeStoryChapter + 1}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            {chapters[activeStoryChapter].title}
          </h2>
          <p className="text-sm text-indigo-300 font-medium mt-1">
            {chapters[activeStoryChapter].subtitle}
          </p>
        </div>

        {/* Visual Interactive Diagram based on chapter */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          {activeStoryChapter === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/20 space-y-2">
                <span className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
                  ❌ Web2 Centralized App
                </span>
                <p className="text-slate-400 text-xs">User → Central Server → Private DB → Bank Account</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>Platform can alter records</li>
                  <li>Withdrawals can be frozen</li>
                  <li>Opaque resolution rules</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                  ✅ Web3 (QDS on Somnia)
                </span>
                <p className="text-slate-400 text-xs">User → Web3 Wallet → Event Smart Contract → Somnia L1</p>
                <ul className="list-disc pl-4 space-y-1 text-emerald-300/80 text-[11px]">
                  <li>Non-custodial smart contract escrow</li>
                  <li>Decentralized oracle verification</li>
                  <li>100% transparent & unstoppable</li>
                </ul>
              </div>
            </div>
          )}

          {activeStoryChapter === 1 && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Somnia Layer 1 Architecture Pipeline
                </span>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  &gt; 100k TPS Benchmark
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Step 1</span>
                  <span className="text-slate-200 font-bold">QDS Order</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Step 2</span>
                  <span className="text-indigo-300 font-bold">EVM Engine</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Step 3</span>
                  <span className="text-purple-300 font-bold">Somnia Consensus</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                  <span className="text-slate-500 block text-[10px]">Finality</span>
                  <span className="text-emerald-400 font-bold">&lt; 500ms Instant</span>
                </div>
              </div>
            </div>
          )}

          {activeStoryChapter === 2 && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-slate-200 block">
                Mathematical Binary Outcome Invariant:
              </span>
              <div className="flex items-center justify-center gap-3 p-3 bg-slate-950 rounded-xl font-mono text-sm">
                <span className="text-emerald-400 font-bold">YES ($0.64)</span>
                <span className="text-slate-500">+</span>
                <span className="text-rose-400 font-bold">NO ($0.36)</span>
                <span className="text-slate-500">=</span>
                <span className="text-indigo-300 font-bold">$1.00 USDso Max Settlement</span>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                If the event happens → YES pays $1.00 (+56% profit on $0.64 investment).
              </p>
            </div>
          )}

          {activeStoryChapter === 3 && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Non-Custodial AI Copilot Workflow
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[11px]">
                <div className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">1. AI Scan</span>
                  <span className="font-bold text-slate-200">Odds & Risk Analysis</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
                <div className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">2. Explainability</span>
                  <span className="font-bold text-purple-300">Why & Confidence %</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
                <div className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">3. User Sign</span>
                  <span className="font-bold text-emerald-400">Wallet Approval</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
                <div className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">4. On-Chain</span>
                  <span className="font-bold text-cyan-400">Somnia Trade</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Written content */}
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <div className="whitespace-pre-line">
            {chapters[activeStoryChapter].content}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveStoryChapter(Math.max(0, activeStoryChapter - 1))}
            disabled={activeStoryChapter === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {activeStoryChapter + 1} / {chapters.length}
          </span>

          <button
            onClick={() => setActiveStoryChapter(Math.min(chapters.length - 1, activeStoryChapter + 1))}
            disabled={activeStoryChapter === chapters.length - 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Next Chapter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
