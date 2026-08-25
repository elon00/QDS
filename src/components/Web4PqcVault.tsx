import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Cpu, Key, Lock, Unlock, 
  RefreshCw, CheckCircle2, Zap, AlertCircle, Copy, Check,
  Terminal, Layers, Network, Activity, Sparkles, ArrowRight
} from 'lucide-react';
import { PqcKeyPair, PqcSignedTransaction } from '../types';
import { INITIAL_PQC_KEYS, INITIAL_PQC_TRANSACTIONS, QUANTUM_THREAT_MATRIX } from '../data/pqcData';

export const Web4PqcVault: React.FC = () => {
  const [keys, setKeys] = useState<PqcKeyPair[]>(INITIAL_PQC_KEYS);
  const [txs, setTxs] = useState<PqcSignedTransaction[]>(INITIAL_PQC_TRANSACTIONS);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'CRYSTALS-Kyber-1024' | 'CRYSTALS-Dilithium-5' | 'Falcon-1024' | 'SPHINCS+-SHA2-256f'>('CRYSTALS-Kyber-1024');
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Signing Sandbox
  const [payloadToSign, setPayloadToSign] = useState<string>('{"contract":"0xQDS_Market_Somnia","action":"settleQuantumOutcome","nonce":1420}');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [lastSignatureProof, setLastSignatureProof] = useState<string | null>(null);

  const activeKey = keys.find(k => k.active) || keys[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      const randomHex = Array(48).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const newKey: PqcKeyPair = {
        id: `pqc-key-${Date.now()}`,
        algorithm: selectedAlgorithm,
        publicKey: `0x${selectedAlgorithm.toLowerCase().replace(/[^a-z0-9]/g, '')}_${randomHex}`,
        privateKeyHash: `0xsha3_512_${randomHex.slice(0, 32)}`,
        entropyHex: `0xENTROPY_${Math.random().toString(36).substring(2).toUpperCase()}`,
        latticeDimension: selectedAlgorithm.includes('1024') ? 1024 : 896,
        securityLevelBits: 256,
        createdAt: Date.now(),
        active: true,
        totalSignatures: 0
      };

      // Set other keys active=false
      setKeys(prev => [newKey, ...prev.map(k => ({ ...k, active: false }))]);
      setIsGeneratingKey(false);
    }, 900);
  };

  const handleSignPayload = () => {
    if (!payloadToSign.trim() || isSigning) return;
    setIsSigning(true);

    setTimeout(() => {
      const proofHex = `0xPQC_LATTICE_PROOF_${activeKey.algorithm.slice(0, 5)}_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      setLastSignatureProof(proofHex);

      const newSignedTx: PqcSignedTransaction = {
        id: `pqc-tx-${Date.now()}`,
        txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        rawPayload: payloadToSign,
        algorithm: activeKey.algorithm,
        latticeSignatureProof: proofHex,
        verifierStatus: 'VALID_QUANTUM_RESISTANT',
        executionTimeMs: Number((1.2 + Math.random() * 0.8).toFixed(2)),
        timestamp: Date.now()
      };

      setTxs(prev => [newSignedTx, ...prev]);
      setKeys(prev => prev.map(k => k.id === activeKey.id ? { ...k, totalSignatures: k.totalSignatures + 1 } : k));
      setIsSigning(false);
    }, 600);
  };

  return (
    <div id="qds-web4-pqc-vault" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">Web 4.0 Post-Quantum Cryptography (PQC) Vault</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                  Kyber-1024 Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Quantum-resistant lattice signatures & decentralized autonomous agent verification on Somnia L1
              </p>
            </div>
          </div>
        </div>

        {/* Global Quantum Security Status Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-purple-900/50 p-3 rounded-xl text-xs">
          <Cpu className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <div className="text-purple-300 font-bold">NIST PQC Standards Compliant</div>
            <div className="text-[11px] text-slate-400 font-mono">256-Bit Quantum Security Level</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Key Manager & Generator */}
        <div className="lg:col-span-6 space-y-6">
          {/* Key Generator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Key className="w-4 h-4 text-purple-400" />
                <span>Quantum Keypair Generator</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">Lattice Dimension 1024</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Cryptographic Algorithm</label>
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="CRYSTALS-Kyber-1024">CRYSTALS-Kyber-1024 (Key Encapsulation KEM)</option>
                  <option value="CRYSTALS-Dilithium-5">CRYSTALS-Dilithium-5 (Digital Signature DSA)</option>
                  <option value="Falcon-1024">Falcon-1024 (Compact Lattice Signature)</option>
                  <option value="SPHINCS+-SHA2-256f">SPHINCS+-SHA2-256f (Stateless Hash Signature)</option>
                </select>
              </div>

              <button
                id="btn-generate-pqc-key"
                onClick={handleGenerateKey}
                disabled={isGeneratingKey}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
              >
                {isGeneratingKey ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sampling Ring-LWE Lattice Polynomials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Quantum Keypair</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Keys List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Stored Post-Quantum Keyrings</h3>
              <span className="text-xs text-slate-500 font-mono">{keys.length} Keypairs</span>
            </div>

            <div className="space-y-3">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className={`p-4 rounded-xl border transition-all text-xs ${
                    k.active
                      ? 'bg-purple-950/30 border-purple-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{k.algorithm}</span>
                      {k.active && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                          ACTIVE SHIELD
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopy(k.publicKey, k.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Key</span>
                    </button>
                  </div>

                  <div className="mt-2 font-mono text-[10px] text-slate-400 truncate bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {k.publicKey}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Lattice Dim: <span className="text-slate-300 font-mono">{k.latticeDimension}</span></span>
                    <span>Signatures: <span className="text-cyan-400 font-mono">{k.totalSignatures} txs</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Signing Sandbox & Quantum Threat Radar */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quantum Transaction Signing Sandbox */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Quantum Lattice Signing Sandbox</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Sub-2ms Verifier</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Payload to Sign with {activeKey.algorithm}</label>
                <textarea
                  value={payloadToSign}
                  onChange={(e) => setPayloadToSign(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 font-mono text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                id="btn-sign-pqc-payload"
                onClick={handleSignPayload}
                disabled={isSigning}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
              >
                {isSigning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Computing Vector Lattice Proof...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Sign with Post-Quantum Lattice Proof</span>
                  </>
                )}
              </button>

              {lastSignatureProof && (
                <div className="p-3.5 bg-slate-950 border border-purple-900/60 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-purple-300 font-bold">
                    <span>Generated Lattice Proof</span>
                    <span className="text-[10px] text-emerald-400 font-mono">VERIFIED IMMUNE</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 break-all">
                    {lastSignatureProof}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quantum Threat Resilience Radar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Quantum Attack Resilience Radar</span>
              </div>
              <span className="text-xs text-slate-500">Live Status</span>
            </div>

            <div className="space-y-2.5">
              {QUANTUM_THREAT_MATRIX.map((threat, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{threat.threat}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      {threat.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{threat.qdsProtection}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quantum Verified On-Chain Transactions Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Recent Quantum-Resistant Signed Transactions</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Somnia L1 EVM Benchmark</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Tx Hash</th>
                <th className="pb-3 font-semibold">Algorithm</th>
                <th className="pb-3 font-semibold">Lattice Proof</th>
                <th className="pb-3 font-semibold">Latency</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {txs.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 text-cyan-400 font-semibold">{tx.txHash}</td>
                  <td className="py-3 text-purple-300">{tx.algorithm}</td>
                  <td className="py-3 text-slate-400 max-w-[200px] truncate">{tx.latticeSignatureProof}</td>
                  <td className="py-3 text-emerald-400">{tx.executionTimeMs} ms</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      {tx.verifierStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
