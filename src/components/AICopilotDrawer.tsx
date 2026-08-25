import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Flame, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { ChatMessage, Market, OutcomeType } from '../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMarket: Market | null;
  markets: Market[];
  onQuickTrade: (market: Market, outcome: OutcomeType, amount: number) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  selectedMarket,
  markets,
  onQuickTrade,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Hello! I am your QDS AI Copilot.**\n\nI continuously synthesize on-chain orderbook liquidity, implied event probabilities, oracle resolutions, and catalysts across Somnia L1.\n\nAsk me anything about market probability mispricings, expected value (EV), or Web3 event contract mechanics!`,
      timestamp: Date.now(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          marketContext: selectedMarket,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) throw new Error('AI Copilot did not respond');
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I analyzed the market factors and provided the breakdown above.',
        timestamp: Date.now(),
        actionSuggestion: data.suggestedAction,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackAiMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `⚡ **Market Intelligence Update:**\n\nQDS Event Contracts execute natively on Somnia EVM with sub-second finality. When pricing odds, look for implied probability vs fundamental catalysts.\n\nAlways enforce strict position sizing according to your risk tolerance.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const samplePrompts = [
    '🔥 Scan top 3 mispriced markets',
    '📖 Explain QDS Event Contracts in simple terms',
    '⚡ Why does Somnia 100k TPS matter for trading?',
    '🛡️ Provide deep risk evaluation on BTC $120k'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              QDS AI Copilot
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 3.7
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {selectedMarket ? `Focus: ${selectedMarket.title.slice(0, 30)}...` : 'Global Somnia Market Scanner'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          id="btn-close-copilot"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-purple-300" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line space-y-2">
                {msg.content}
              </div>

              {/* Action suggestion pill if provided */}
              {msg.actionSuggestion && (
                <div className="mt-3 pt-2.5 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-purple-300 font-bold block uppercase">Recommended Execution</span>
                      <span className="font-semibold text-slate-100">
                        Buy {msg.actionSuggestion.outcome} ($ {msg.actionSuggestion.suggestedAmount})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const target = markets.find(m => m.id === msg.actionSuggestion?.marketId) || selectedMarket || markets[0];
                        if (target) {
                          onQuickTrade(target, msg.actionSuggestion.outcome, msg.actionSuggestion.suggestedAmount);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <span className="block text-[10px] text-slate-500 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-indigo-300" />
              </div>
            )}
          </div>
        ))}

        {isAiTyping && (
          <div className="flex gap-2.5 items-center text-xs text-purple-300 bg-purple-950/30 p-3 rounded-2xl border border-purple-900/40 w-fit">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span>AI Copilot is evaluating prediction probability distributions...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/80 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Copilot about any market..."
            id="input-copilot-msg"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAiTyping}
            id="btn-send-copilot"
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
