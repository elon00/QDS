import React, { useState } from 'react';
import { 
  Trophy, 
  Target, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Video, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2,
  FileText,
  MessageSquare,
  Rocket,
  Shield,
  Bot
} from 'lucide-react';

interface HackathonPitchDeckProps {}

export const HackathonPitchDeck: React.FC<HackathonPitchDeckProps> = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Slide 1: Problem & Vision',
      heading: 'The Next Generation of Prediction Markets & DeFi on Somnia L1',
      points: [
        'High latency & high gas fees on legacy L1s prevent high-frequency prediction trading, automated market making, and retail adoption.',
        'Binary outcomes and risk parameters are opaque for retail users without explainable probabilistic intelligence and multi-model agentic guidance.',
        'Vision: QDS combines Somnia 100k+ TPS speed with Multi-Model Agentic AI (Gemini 3.7 Flash Thinking & 3.1 Pro), Token Launchpad bonding curves, Conway cellular volatility modeling, and Web 4.0 Post-Quantum Lattice Security.'
      ],
      tag: 'Problem & Opportunity'
    },
    {
      title: 'Slide 2: Complete Architecture & Pillars',
      heading: 'Integrated Web 4.0 Quantitative Ecosystem on Somnia EVM',
      points: [
        'Event Contract Market Radar: Real-time probability scanner, dynamic odds quotes, and oracle resolution rules on Somnia Shannon Testnet.',
        'Multi-Model Agentic Chatbot: Autonomous reasoning traces, image chart pattern perception, and 1-click execution triggers across all views.',
        'Fair-Launch Token Launchpad: Mathematical quadratic bonding curve P(S) = P0 + k*S^2 with AI anti-rug audits and auto-graduation at $69,000 USDso.',
        'Conway AI Automaton: Emergent 2D cellular automaton market simulator modeling trader swarms, entropy, and flash crash dynamics.',
        'Web 4.0 Post-Quantum Cryptography Vault: 256-bit NIST PQC lattice signature verification (CRYSTALS-Kyber-1024 / Dilithium-5) on Somnia L1.'
      ],
      tag: 'Product Architecture'
    },
    {
      title: 'Slide 3: 2-Minute Demo Video Script',
      heading: 'Step-by-Step Demo Flow for Hackathon Submission Video',
      points: [
        '0:00 - 0:20: Hook & Overview (Fast EVM prediction trading meets Multi-Model AI on Somnia L1).',
        '0:20 - 0:45: Market Radar & Live Probability Trajectory (Trading YES/NO with sub-second finality).',
        '0:45 - 1:15: Agentic Chatbot Deep-Dive (Selecting Gemini 3.7 Thinking, visual chart analysis, and auto-executing on-chain trades).',
        '1:15 - 1:40: Token Launchpad & AI Anti-Rug Audit (Deploying bonding curve tokens with automated Somnia DEX graduation).',
        '1:40 - 2:00: Conway Automaton & PQC Vault (Cellular market telemetry and quantum-immune Kyber-1024 key verification).'
      ],
      tag: 'Submission Deliverable'
    },
    {
      title: 'Slide 4: Judging Criteria Alignment (100% Target)',
      heading: 'How QDS Maximizes All 5 Hackathon Score Pillars',
      points: [
        'Technical Implementation (25%): Full Solidity Smart Contracts suite (QDSEventMarketRouter, QDSBondingCurveToken, QDSQuantumVault, QDSConwayRegistry), real Web3 wallet integration, and automated Somnia Shannon Testnet deployer.',
        'UX & Design (20%): Pro trading terminal meets intuitive consumer interface with live SVG charts, voice readout, dark theme, and dual grid/table views.',
        'Innovation & Originality (20%): First platform unifying Agentic Multi-Model LLMs, Conway cellular market emergence, and NIST Post-Quantum lattice cryptography.',
        'Business & Ecosystem Impact (20%): Drives organic STT gas consumption, expands Somnia TVL, and creates sustainable trading activity.',
        'Presentation & Demo (15%): Structured 4-slide pitch deck, interactive Web3 story guide, and production-ready working prototype.'
      ],
      tag: 'Scoring Breakdown'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Somnia × DreamDEX Hackathon ($5,000 USDso Prize Pool)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          QDS Project Pitch Deck & Submission Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          A polished judge presentation deck aligned directly with official judging criteria and Somnia L1 capabilities.
        </p>
      </div>

      {/* Judging Criteria Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-xl border border-indigo-500/30">
          <span className="text-indigo-400 font-bold block text-sm">25%</span>
          <span className="text-slate-400 text-[11px]">Technical</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
          <span className="text-emerald-400 font-bold block text-sm">20%</span>
          <span className="text-slate-400 text-[11px]">UX & Design</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-purple-500/30">
          <span className="text-purple-400 font-bold block text-sm">20%</span>
          <span className="text-slate-400 text-[11px]">Innovation</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-cyan-500/30">
          <span className="text-cyan-400 font-bold block text-sm">20%</span>
          <span className="text-slate-400 text-[11px]">Ecosystem</span>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30 col-span-2 sm:col-span-1">
          <span className="text-amber-400 font-bold block text-sm">15%</span>
          <span className="text-slate-400 text-[11px]">Demo & Pitch</span>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSlide === idx
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {s.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Active Slide Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            {slides[activeSlide].tag}
          </span>
          <span className="text-xs font-mono text-slate-500">
            Slide {activeSlide + 1} of {slides.length}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100">
          {slides[activeSlide].heading}
        </h2>

        <div className="space-y-4">
          {slides[activeSlide].points.map((pt, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
