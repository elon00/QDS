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
  MessageSquare
} from 'lucide-react';

interface HackathonPitchDeckProps {}

export const HackathonPitchDeck: React.FC<HackathonPitchDeckProps> = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const slides = [
    {
      title: 'Slide 1: Problem & Vision',
      heading: 'The Fragmented State of Web3 Prediction Markets',
      points: [
        'High latency & high gas fees on legacy L1s prevent real-time algorithmic market making and retail adoption.',
        'Binary outcomes are complex for everyday users without explainable probabilistic intelligence.',
        'Vision: QDS AI Prediction Radar combines Somnia 100k+ TPS speed with Gemini 3.7 Copilot intelligence to make on-chain prediction trading effortless.'
      ],
      tag: 'Problem & Opportunity'
    },
    {
      title: 'Slide 2: The Solution & Architecture',
      heading: 'AI-Guided, Non-Custodial Event Contracts on Somnia L1',
      points: [
        'Real-time Market Radar scanning odds, implied probabilities, and on-chain liquidity depth.',
        'Explainable AI Copilot providing dynamic fair-value probability matrices, bull/bear drivers, and risk scores.',
        'QDS Bot Kit Studio enabling one-click deployment of automated sentiment and arbitrage agents.',
        'Sub-second EVM execution powered by Somnia Shannon Testnet with near-zero STT gas overhead.'
      ],
      tag: 'Product Architecture'
    },
    {
      title: 'Slide 3: 2-Minute Demo Video Script',
      heading: 'Step-by-Step Demo Flow for Hackathon Submission',
      points: [
        '0:00 - 0:20: Hook & The Problem (Slow, confusing prediction markets).',
        '0:20 - 0:50: Live Tour of QDS AI Radar & Probability Trajectory Chart.',
        '0:50 - 1:20: AI Copilot in Action (Asking about BTC $120k & reviewing explainable risk breakdown).',
        '1:20 - 1:45: Interactive Web3 EVM Trade Execution with Somnia sub-second finality & confetti.',
        '1:45 - 2:00: Bot Kit Studio & Future Roadmap on Somnia Mainnet.'
      ],
      tag: 'Submission Deliverable'
    },
    {
      title: 'Slide 4: Judging Criteria Alignment (100% Target)',
      heading: 'How QDS AI Radar Maximizes All 5 Score Pillars',
      points: [
        'Technical Implementation (25%): Full EVM ABI transaction simulation, QDS AMM pricing invariants, Gemini 3.7 API integration, and Bot Kit SDK exporter.',
        'UX & Design (20%): Pro trading terminal meets clean consumer interface with live SVG charts, dark/light contrast, and comprehensive onboarding.',
        'Innovation & Originality (20%): Autonomous AI explainability layer coupled with non-custodial EIP-712 transaction authorization.',
        'Business & Ecosystem Impact (20%): Drives organic STT gas consumption, expands QDS TVL, and introduces consumer-ready prediction markets.',
        'Presentation & Demo (15%): Structured 5-slide deck, interactive Web3 story mode, and end-to-end working testnet prototype.'
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
          <span>Somnia × QDS Hackathon ($5,000 USDso Prize Pool)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Project Pitch Deck & Submission Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          A polished investor and judge presentation deck aligned directly with official judging criteria.
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
            {s.title}
          </button>
        ))}
      </div>

      {/* Slide Presentation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {slides[activeSlide].tag}
          </span>
          <span className="text-xs font-mono text-slate-400">
            SLIDE 0{activeSlide + 1} OF 0{slides.length}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-6">
            {slides[activeSlide].heading}
          </h2>

          <div className="space-y-4">
            {slides[activeSlide].points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Documentation Resources */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://docs.dreamdex.io/developers/event-contracts"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Official Event Contracts Docs</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <a
            href="https://t.me/+XHq0F0JXMyhmMzM0"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Somnia Dev Community & STT Faucet</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
};
