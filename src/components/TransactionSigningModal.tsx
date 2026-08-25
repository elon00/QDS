import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Zap, 
  AlertTriangle, 
  ArrowRight,
  Copy,
  Check,
  Fuel,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Market, OutcomeType, WalletState, TransactionReceipt } from '../types';
import { dispatchSomniaTransaction, CONTRACT_ADDRESSES } from '../utils/web3';

interface TransactionSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market | null;
  outcome: OutcomeType;
  amountUSDso: number;
  wallet: WalletState;
  onSuccess: (receipt: TransactionReceipt) => void;
}

type TxStep = 'REVIEW' | 'SIGNING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';

export const TransactionSigningModal: React.FC<TransactionSigningModalProps> = ({
  isOpen,
  onClose,
  market,
  outcome,
  amountUSDso,
  wallet,
  onSuccess,
}) => {
  if (!isOpen || !market) return null;

  const [step, setStep] = useState<TxStep>('REVIEW');
  const [txHash, setTxHash] = useState<string>('');
  const [blockNumber, setBlockNumber] = useState<number>(3829142);
  const [copiedHash, setCopiedHash] = useState(false);

  const pricePerShare = outcome === 'YES' ? market.yesPrice : market.noPrice;
  const estimatedShares = amountUSDso > 0 && pricePerShare > 0 ? amountUSDso / pricePerShare : 0;
  const estimatedGasSTT = 0.000384;
  const maxPayout = estimatedShares * 1.00;

  useEffect(() => {
    setStep('REVIEW');
    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setTxHash(randomHash);
    setBlockNumber(Math.floor(3829000 + Math.random() * 5000));
  }, [isOpen, market?.id, outcome, amountUSDso]);

  const handleSignTransaction = async () => {
    setStep('SIGNING');
    
    try {
      // Step 1: Dispatches real or simulated Somnia transaction
      const txResult = await dispatchSomniaTransaction({
        fromAddress: wallet.address,
        toAddress: CONTRACT_ADDRESSES.EventMarketRouter,
        valueSTT: 0,
        isRealWallet: false, // fallback to instant sub-second Somnia L1 confirmation
      });

      await new Promise((r) => setTimeout(r, 600));
      setStep('CONFIRMING');
      await new Promise((r) => setTimeout(r, 800));

      setTxHash(txResult.txHash);
      setBlockNumber(txResult.blockNumber);
      setStep('SUCCESS');

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      const receipt: TransactionReceipt = {
        txHash: txResult.txHash,
        blockNumber: txResult.blockNumber,
        gasUsedSTT: estimatedGasSTT,
        marketTitle: market.title,
        outcome,
        shares: estimatedShares,
        totalCostUSDso: amountUSDso,
        timestamp: Date.now(),
        status: 'CONFIRMED',
      };

      onSuccess(receipt);
    } catch (err) {
      console.error('Transaction failed:', err);
      setStep('REVIEW');
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        id="modal-tx-signing"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Sign Somnia Event Contract Transaction
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                EVM Network: Somnia Shannon Testnet (50312)
              </p>
            </div>
          </div>

          {step !== 'SIGNING' && step !== 'CONFIRMING' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body based on step */}
        <div className="p-5 space-y-4">
          
          {step === 'REVIEW' && (
            <>
              {/* Order Summary Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Target Market:</span>
                    <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                      {market.title}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                    outcome === 'YES' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {outcome} Outcome
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Investment:</span>
                    <span className="font-mono font-bold text-slate-100">${amountUSDso.toFixed(2)} USDso</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Shares to Receive:</span>
                    <span className="font-mono font-bold text-slate-100">{estimatedShares.toFixed(2)} Shares</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Avg Execution Price:</span>
                    <span className="font-mono text-slate-300">${pricePerShare.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Max Settlement Payout:</span>
                    <span className="font-mono text-emerald-400 font-bold">${maxPayout.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ABI Smart Contract Call Preview */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center justify-between text-indigo-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> Contract Interaction ABI
                  </span>
                  <span className="text-[10px] text-slate-500">QDSEventMarketRouter</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded text-[10px] text-slate-300 overflow-x-auto">
                  <code>
                    QDSEventMarketRouter.buyShares&#40;
                    <br />&nbsp;&nbsp;marketId: "{market.id}",
                    <br />&nbsp;&nbsp;outcome: {outcome === 'YES' ? 'Outcome.YES' : 'Outcome.NO'},
                    <br />&nbsp;&nbsp;amountInUSDso: {amountUSDso}e18,
                    <br />&nbsp;&nbsp;minSharesOut: {(estimatedShares * 0.995).toFixed(2)}e18
                    <br />&#41;
                  </code>
                </div>
              </div>

              {/* Gas estimation preview */}
              <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  Estimated Somnia Gas Fee:
                </span>
                <span className="font-mono font-semibold text-emerald-400">
                  {estimatedGasSTT} STT (~$0.0001)
                </span>
              </div>

              {/* Sign Action Button */}
              <button
                onClick={handleSignTransaction}
                id="btn-confirm-sign-tx"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Sign & Broadcast to Somnia L1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'SIGNING' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
              <h4 className="font-bold text-slate-100 text-base">
                Broadcasting to Somnia L1...
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Authorizing cryptographic signature on Somnia Shannon Testnet with 100k+ TPS execution.
              </p>
            </div>
          )}

          {step === 'CONFIRMING' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-bold text-slate-100 text-base">
                Confirming Block Finality...
              </h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Sub-second state validation on Somnia Layer 1...
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-lg">
                  Order Filled on Somnia L1!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  You now hold <span className="font-bold text-emerald-400 font-mono">{estimatedShares.toFixed(2)} {outcome}</span> outcome tokens.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Block Number:</span>
                  <span className="text-slate-200 font-semibold">#{blockNumber}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Gas Consumed:</span>
                  <span className="text-emerald-400 font-semibold">{estimatedGasSTT} STT</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                    <span>Transaction Hash:</span>
                    <a
                      href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded text-[11px] text-indigo-300">
                    <span className="truncate">{txHash}</span>
                    <button
                      onClick={copyHash}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer ml-1"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                id="btn-done-tx-modal"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                View in Portfolio / Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
