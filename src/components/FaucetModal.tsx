import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  Coins, 
  CheckCircle2, 
  Zap, 
  ExternalLink, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTokens: (sttAmount: number, usdsoAmount: number) => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaimTokens,
}) => {
  if (!isOpen) return null;

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsClaiming(false);
    setClaimed(true);

    onClaimTokens(5.0, 1000.0);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onClose();
      setClaimed(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        id="modal-faucet"
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Somnia Shannon Testnet Faucet
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Chain ID: 50312</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {claimed ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-100 text-base">
              Testnet Tokens Dispatched!
            </h4>
            <p className="text-xs text-slate-300 font-mono">
              +5.0 STT (Gas) & +1,000.00 USDso (Trading Capital)
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Request testnet STT for Somnia transaction gas fees and USDso test tokens for trading prediction contracts on QDS.
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">STT (Gas Token):</span>
                  <span className="text-emerald-400 font-bold">+5.000 STT</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">USDso (Trading):</span>
                  <span className="text-indigo-400 font-bold">+1,000.00 USDso</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>Zero real cost • Practice playground for Somnia Hackathon</span>
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={isClaiming}
              id="btn-claim-faucet-tokens"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {isClaiming ? (
                <span>Minting Testnet Tokens on Somnia...</span>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Claim 5 STT + 1,000 USDso</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
