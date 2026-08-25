import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  Coins, 
  CheckCircle2, 
  Zap, 
  ExternalLink, 
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Send,
  PlusCircle,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { addSomniaNetworkToWallet, SOMNIA_TESTNET_CONFIG } from '../utils/web3';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTokens: (sttAmount: number, usdsoAmount: number) => void;
  walletAddress?: string;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({
  isOpen,
  onClose,
  onClaimTokens,
  walletAddress = '0x8fB2aC9981e4D2e7208C90C51322f2Eb9e8c4601',
}) => {
  if (!isOpen) return null;

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [addingNetwork, setAddingNetwork] = useState(false);
  const [networkAdded, setNetworkAdded] = useState(false);

  const handleClaimSandbox = async () => {
    setIsClaiming(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsClaiming(false);
    setClaimed(true);

    onClaimTokens(5.0, 1000.0);

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onClose();
      setClaimed(false);
    }, 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleAddNetwork = async () => {
    setAddingNetwork(true);
    try {
      await addSomniaNetworkToWallet();
      setNetworkAdded(true);
      setTimeout(() => setNetworkAdded(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to add Somnia network to browser wallet.');
    } finally {
      setAddingNetwork(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        id="modal-faucet"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <span>Somnia Shannon Testnet Faucet Hub</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium border border-emerald-500/30">
                  Chain: 50312
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Sub-Second Finality • 100k+ TPS EVM
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {claimed ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-100 text-lg">
              Testnet Tokens Dispatched!
            </h4>
            <p className="text-xs text-emerald-300 font-mono">
              +5.000 STT (Gas) & +1,000.00 USDso (Trading Capital)
            </p>
            <p className="text-[11px] text-slate-400">
              Balances updated across all QDS Prediction & Launchpad modules.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Section 1: Instant Sandbox Claim */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant QDS Testnet Allocation</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Instant Mint
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-0.5">STT (Gas Token)</span>
                  <span className="text-emerald-400 font-bold text-sm">+5.00 STT</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-0.5">USDso (Prediction Capital)</span>
                  <span className="text-indigo-400 font-bold text-sm">+1,000.00 USDso</span>
                </div>
              </div>

              <button
                onClick={handleClaimSandbox}
                disabled={isClaiming}
                id="btn-claim-faucet-tokens"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {isClaiming ? (
                  <span>Minting Testnet Tokens on Somnia...</span>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Claim 5 STT + 1,000 USDso Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Section 2: Official Somnia Dev Community Faucet (Telegram) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-100 text-xs">Official Somnia Dev Telegram Faucet</span>
                </div>
                <a
                  href="https://t.me/+XHq0F0JXMyhmMzM0"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold underline"
                >
                  <span>Open Telegram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                Join the official Somnia Global Dev Community on Telegram to request test STT tokens directly for live on-chain deployments and testing.
              </p>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono truncate flex-1">
                  {walletAddress}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Section 3: MetaMask Somnia Network Helper */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">1-Click MetaMask Config</div>
                  <div className="text-[10px] text-slate-400 font-mono">RPC: dream-rpc.shannon.somnia.network</div>
                </div>
              </div>
              <button
                onClick={handleAddNetwork}
                disabled={addingNetwork}
                className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer transition-colors"
              >
                {networkAdded ? 'Network Added!' : addingNetwork ? 'Adding...' : 'Add to MetaMask'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
