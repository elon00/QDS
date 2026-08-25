import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Image as ImageIcon, Volume2, VolumeX, 
  Cpu, ShieldCheck, ArrowRight, Zap, RefreshCw, X, ChevronDown, 
  ChevronUp, CheckCircle2, AlertCircle, Play, Layers, TrendingUp,
  Terminal, Sliders, Shield
} from 'lucide-react';
import { Market, AgentModel, AgentModelId, ChatMessage, OutcomeType, WalletState } from '../types';

interface AgenticChatbotProps {
  markets: Market[];
  selectedMarket: Market | null;
  onSelectMarket: (market: Market) => void;
  onExecuteTrade: (marketId: string, outcome: OutcomeType, amountUSDso: number) => void;
  onNavigateToTab: (tab: string) => void;
  wallet: WalletState;
}

const AVAILABLE_MODELS: AgentModel[] = [
  {
    id: 'gemini-3.7-flash-thinking',
    name: 'Gemini 3.7 Flash Thinking',
    tagline: 'High-speed reasoning with explicit multi-step planning',
    badge: 'Reasoning Pro',
    provider: 'Google DeepMind',
    reasoningEffort: 'HIGH',
    isQuantumReady: true
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    tagline: 'Maximum depth for complex game theory & market dynamics',
    badge: 'Deep Math',
    provider: 'Google DeepMind',
    reasoningEffort: 'MAX',
    isQuantumReady: true
  },
  {
    id: 'qds-quantum-quant',
    name: 'QDS Quantum Lattice Quant',
    tagline: 'Specialized in PQC Kyber-1024 proofs & bonding curves',
    badge: 'Quantum Agent',
    provider: 'QDS Core',
    reasoningEffort: 'HIGH',
    isQuantumReady: true
  },
  {
    id: 'qds-deep-agent',
    name: 'QDS Conway Swarm Agent',
    tagline: 'Cellular automaton simulation & emergent liquidity modeling',
    badge: 'Swarm AI',
    provider: 'QDS Core',
    reasoningEffort: 'BALANCED',
    isQuantumReady: false
  }
];

export const AgenticChatbot: React.FC<AgenticChatbotProps> = ({
  markets,
  selectedMarket,
  onSelectMarket,
  onExecuteTrade,
  onNavigateToTab,
  wallet
}) => {
  const [selectedModelId, setSelectedModelId] = useState<AgentModelId>('gemini-3.7-flash-thinking');
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `### Welcome to QDS Multi-Model Agentic Market Chatbot ⚡\n\nI am your autonomous quantitative strategist, launchpad advisor, and post-quantum cryptographer on **Somnia L1** (100k+ TPS, sub-second finality).\n\n**What would you like to execute?**\n- 📊 **Analyze Market Probabilities**: Deep-dive into event contract odds, orderbook depth & oracle feeds.\n- 🚀 **Token Launchpad**: Deploy fair-launch bonding curve tokens with automated AI anti-rug audits.\n- 🧬 **Conway AI Automaton**: Model cellular market liquidity and flash crash emergence.\n- ⚛️ **Web 4.0 Post-Quantum**: Verify Kyber-1024 lattice proofs & quantum-safe transaction signing.`,
      timestamp: Date.now(),
      modelId: 'gemini-3.7-flash-thinking',
      reasoningSteps: [
        { title: 'Agent Initialization', detail: 'Synchronized with Somnia L1 RPC & QDS Event Contracts.', status: 'complete', timestamp: Date.now() - 100 }
      ]
    }
  ]);

  const activeModel = AVAILABLE_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const msgToSend = textOverride || inputMessage;
    if ((!msgToSend.trim() && !attachedImage) || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgToSend.trim() || 'Analyze attached chart image',
      timestamp: Date.now(),
      attachments: attachedImage ? [{ name: 'chart_snapshot.png', type: 'image/png', dataUrl: attachedImage }] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    const currentAttachment = attachedImage;
    setAttachedImage(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          modelId: selectedModelId,
          marketContext: selectedMarket,
          imageAttachment: currentAttachment
        })
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: Date.now(),
        modelId: selectedModelId,
        reasoningSteps: data.reasoningSteps,
        actionSuggestion: data.actionSuggestion
      };

      setMessages(prev => [...prev, assistantMessage]);
      setExpandedReasoning(prev => ({ ...prev, [assistantMessage.id]: true }));

      if (speechEnabled && data.reply) {
        handleSpeakText(data.reply);
      }
    } catch (err) {
      console.error('Agent chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Agent network momentarily unreachable. Reconnecting to Somnia L1 node...',
          timestamp: Date.now(),
          modelId: selectedModelId
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div id="qds-agentic-chatbot-container" className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header & Model Switcher */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 p-4 px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">QDS Agentic Multimodal Chatbot</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Web 4.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous reasoning, image chart perception & on-chain action triggers</p>
          </div>
        </div>

        {/* Model Switcher Pill Group */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <Cpu className="w-4 h-4 text-cyan-400 ml-2 mr-1" />
          <div className="flex flex-wrap gap-1">
            {AVAILABLE_MODELS.map(m => (
              <button
                key={m.id}
                id={`btn-model-${m.id}`}
                onClick={() => setSelectedModelId(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedModelId === m.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Context & Audio Controls */}
        <div className="flex items-center gap-2">
          {selectedMarket && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="truncate max-w-[160px] font-medium">{selectedMarket.title}</span>
            </div>
          )}
          <button
            id="btn-toggle-speech"
            onClick={() => {
              setSpeechEnabled(!speechEnabled);
              if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            title={speechEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
            className={`p-2 rounded-lg border transition-all ${
              speechEnabled
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Model Spec Bar */}
      <div className="bg-slate-950/50 border-b border-slate-800/50 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">Provider:</span>
            <span className="text-slate-300 font-medium">{activeModel.provider}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-slate-500">Effort:</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono">
              {activeModel.reasoningEffort}
            </span>
          </span>
          {activeModel.isQuantumReady && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3 h-3" /> PQC Kyber-1024 Lattice Ready
            </span>
          )}
        </div>
        <div className="text-slate-500 text-[11px]">
          Wallet: <span className="text-cyan-400 font-mono">${wallet.usdsoBalance.toFixed(2)} USDso</span>
        </div>
      </div>

      {/* Main Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const hasReasoning = msg.reasoningSteps && msg.reasoningSteps.length > 0;
          const isExpanded = expandedReasoning[msg.id] ?? false;

          return (
            <div
              key={msg.id}
              className={`flex gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-3xl flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                {/* Agent Thought / Reasoning Steps Drawer */}
                {isAssistant && hasReasoning && (
                  <div className="w-full mb-2 border border-cyan-900/50 bg-slate-950/70 rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-cyan-400 hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="font-semibold tracking-wide">Agentic Reasoning & Multi-Step Trace</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                          {msg.reasoningSteps?.length} steps
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="p-3 pt-1 border-t border-slate-800/80 space-y-2 bg-slate-950/90 font-mono text-[11px]">
                        {msg.reasoningSteps?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-cyan-200">{step.title}: </span>
                              <span className="text-slate-400">{step.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-lg'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  {/* Attachments if any */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-3">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-white/20 max-w-sm">
                          <img src={att.dataUrl} alt={att.name} className="w-full h-auto object-cover max-h-56" />
                          <div className="p-1.5 bg-black/40 text-[11px] text-white/80 font-mono flex items-center gap-1.5">
                            <ImageIcon className="w-3 h-3" /> {att.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render content with basic markdown format */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>

                {/* Action Trigger Card (Autonomous Suggestion) */}
                {isAssistant && msg.actionSuggestion && (
                  <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-xl max-w-xl text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>Autonomous Execution Trigger</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-mono">
                        {msg.actionSuggestion.type}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs">{msg.actionSuggestion.reason}</p>

                    <div className="flex items-center gap-2 pt-1">
                      {msg.actionSuggestion.type === 'TRADE' && msg.actionSuggestion.marketId && (
                        <button
                          onClick={() => {
                            if (msg.actionSuggestion?.marketId && msg.actionSuggestion?.outcome) {
                              onExecuteTrade(
                                msg.actionSuggestion.marketId,
                                msg.actionSuggestion.outcome,
                                msg.actionSuggestion.suggestedAmount || 50
                              );
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Execute ${msg.actionSuggestion.suggestedAmount || 50} on {msg.actionSuggestion.outcome}
                        </button>
                      )}

                      {msg.actionSuggestion.type === 'LAUNCH_TOKEN' && (
                        <button
                          onClick={() => onNavigateToTab('launchpad')}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          Open Token Launchpad
                        </button>
                      )}

                      {msg.actionSuggestion.type === 'PQC_SIGN' && (
                        <button
                          onClick={() => onNavigateToTab('pqc')}
                          className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Open PQC Vault
                        </button>
                      )}

                      {msg.actionSuggestion.type === 'CONWAY_SEED' && (
                        <button
                          onClick={() => onNavigateToTab('conway')}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Launch Conway Automaton
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamp & Speaker icon */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isAssistant && (
                    <button
                      onClick={() => handleSpeakText(msg.content)}
                      className="hover:text-cyan-400 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 max-w-md shadow-lg flex items-center gap-3 text-xs text-cyan-300">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Multi-Model Agent synthesising on-chain probabilities & quantitative models...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="bg-slate-950/60 border-t border-slate-800/60 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs text-slate-400 scrollbar-none">
        <span className="text-slate-500 text-[11px] whitespace-nowrap font-medium">Quick Prompts:</span>
        <button
          onClick={() => handleSendMessage("Analyze Somnia 100k TPS milestone prediction odds and expected value.")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          📊 Somnia TPS Odds
        </button>
        <button
          onClick={() => handleSendMessage("How do I launch a fair meme token on the Somnia bonding curve?")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          🚀 Launchpad Bonding Curve
        </button>
        <button
          onClick={() => handleSendMessage("Explain Post-Quantum Kyber-1024 lattice signatures on EVM.")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          ⚛️ PQC Kyber Lattice
        </button>
        <button
          onClick={() => handleSendMessage("How does Conway's Game of Life simulate market liquidity clusters?")}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
        >
          🧬 Conway Market Simulation
        </button>
      </div>

      {/* Image Preview if attached */}
      {attachedImage && (
        <div className="bg-slate-950 px-6 py-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Chart snapshot attached (Ready for visual pattern reasoning)</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          id="btn-attach-chart-image"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Chart or Orderbook Screenshot"
          className={`p-2.5 rounded-xl border transition-all ${
            attachedImage
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <input
          id="input-agent-chat"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={`Ask ${activeModel.name} anything about markets, bonding curves, PQC keys, or Conway simulations...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />

        <button
          id="btn-send-agent-chat"
          onClick={() => handleSendMessage()}
          disabled={(!inputMessage.trim() && !attachedImage) || isGenerating}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Execute</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
