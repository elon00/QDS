import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, FastForward, Sparkles, Sliders, 
  Activity, Layers, Zap, Info, Shield, CheckCircle2, RefreshCw,
  Cpu, Flame, Eye, Compass
} from 'lucide-react';
import { CONWAY_PRESETS } from '../data/conwayPresets';
import { AutomatonPreset, AutomatonTelemetry } from '../types';

const GRID_SIZE = 36;

export const ConwayAutomaton: React.FC = () => {
  // 2D Grid state
  const [grid, setGrid] = useState<number[][]>(() => {
    const initial = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    // Default seed with a nice Gosper glider or pulsar
    const preset = CONWAY_PRESETS[0];
    preset.grid.forEach(([x, y]) => {
      if (x < GRID_SIZE && y < GRID_SIZE) {
        initial[y][x] = 1;
      }
    });
    return initial;
  });

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(200);
  const [generation, setGeneration] = useState<number>(0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(CONWAY_PRESETS[0].id);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawMode, setDrawMode] = useState<'BIRTH' | 'KILL'>('BIRTH');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiInsight, setAiInsight] = useState<string | null>(
    "Gosper Glider Gun emits periodic liquidity impulses modeling automated algorithmic market-making cycles."
  );

  // Telemetry
  const [telemetry, setTelemetry] = useState<AutomatonTelemetry>({
    generation: 0,
    liveCellCount: 36,
    densityPercent: 2.8,
    marketEntropy: 0.38,
    volatilityIndex: 14.2,
    liquidityClustering: 68.4,
    quantumEntanglementCoeff: 0.74
  });

  // Cell color theme mode
  const [theme, setTheme] = useState<'NEON_CYAN' | 'QUANTUM_EMERALD' | 'SOLAR_AMBER' | 'VOID_PURPLE'>('NEON_CYAN');

  // Compute next Conway generation
  const computeNextGen = useCallback((currentGrid: number[][]) => {
    const next = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    let living = 0;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        // Count 8 neighbors
        let neighbors = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = (r + dr + GRID_SIZE) % GRID_SIZE;
            const nc = (c + dc + GRID_SIZE) % GRID_SIZE;
            neighbors += currentGrid[nr][nc];
          }
        }

        // Standard Conway B3/S23
        if (currentGrid[r][c] === 1) {
          if (neighbors === 2 || neighbors === 3) {
            next[r][c] = 1;
            living++;
          }
        } else {
          if (neighbors === 3) {
            next[r][c] = 1;
            living++;
          }
        }
      }
    }

    const totalCells = GRID_SIZE * GRID_SIZE;
    const density = (living / totalCells) * 100;
    const entropy = Math.min(1.0, (living * 3.1415) / (totalCells * 0.4));
    const volatility = Math.min(100, Math.max(5, (density * 2.4) + (entropy * 30)));
    const clustering = Math.min(99, Math.max(10, 50 + (living % 40)));
    const entanglement = Number((0.4 + (density / 100) * 0.5 + Math.sin(density) * 0.1).toFixed(2));

    setTelemetry(prev => ({
      generation: prev.generation + 1,
      liveCellCount: living,
      densityPercent: Number(density.toFixed(1)),
      marketEntropy: Number(entropy.toFixed(2)),
      volatilityIndex: Number(volatility.toFixed(1)),
      liquidityClustering: Number(clustering.toFixed(1)),
      quantumEntanglementCoeff: entanglement
    }));

    return next;
  }, []);

  // Interval loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setGrid(prev => computeNextGen(prev));
      setGeneration(g => g + 1);
    }, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, speedMs, computeNextGen]);

  // Load preset
  const handleLoadPreset = (preset: AutomatonPreset) => {
    setSelectedPresetId(preset.id);
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    preset.grid.forEach(([x, y]) => {
      if (x < GRID_SIZE && y < GRID_SIZE) {
        newGrid[y][x] = 1;
      }
    });
    setGrid(newGrid);
    setGeneration(0);
    setAiInsight(preset.marketEffect);
  };

  // Random seed
  const handleRandomSeed = (fillRatio = 0.18) => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => 
      Array(GRID_SIZE).fill(0).map(() => Math.random() < fillRatio ? 1 : 0)
    );
    setGrid(newGrid);
    setGeneration(0);
    setAiInsight(`Stochastic random entropy seed initialized at ${(fillRatio * 100).toFixed(0)}% initial liquidity density.`);
  };

  // Clear grid
  const handleClear = () => {
    setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
    setGeneration(0);
    setIsRunning(false);
    setAiInsight("Grid cleared. Click or drag on the canvas to birth custom trader nodes.");
  };

  // Toggle cell on click/drag
  const handleCellInteract = (r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = drawMode === 'BIRTH' ? 1 : 0;
      return next;
    });
  };

  // AI Pattern Generator
  const handleGenerateAiPattern = async () => {
    if (!aiPrompt.trim() || isAiGenerating) return;
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/ai/conway-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();

      if (data.cells && Array.isArray(data.cells)) {
        const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
        data.cells.forEach(([x, y]: [number, number]) => {
          const clampedX = Math.min(GRID_SIZE - 1, Math.max(0, x));
          const clampedY = Math.min(GRID_SIZE - 1, Math.max(0, y));
          newGrid[clampedY][clampedX] = 1;
        });
        setGrid(newGrid);
        setGeneration(0);
        setAiInsight(`${data.patternName || 'AI Synthesized Pattern'}: ${data.marketCorrelation || data.description}`);
      }
    } catch (err) {
      console.error('AI Conway generation error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'QUANTUM_EMERALD': return 'bg-emerald-400 shadow-emerald-500/50';
      case 'SOLAR_AMBER': return 'bg-amber-400 shadow-amber-500/50';
      case 'VOID_PURPLE': return 'bg-purple-400 shadow-purple-500/50';
      default: return 'bg-cyan-400 shadow-cyan-500/50';
    }
  };

  return (
    <div id="qds-conway-automaton" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">Conway AI Automaton Market Simulator</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Cellular Emergence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulating market liquidity clusters, phase transitions, and quantum percolation via Conway rules (B3/S23)
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Generation</span>
            <div className="text-cyan-400 font-mono font-bold text-sm">#{generation}</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Active Traders</span>
            <div className="text-emerald-400 font-mono font-bold text-sm">{telemetry.liveCellCount} cells</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Volatility</span>
            <div className="text-amber-400 font-mono font-bold text-sm">{telemetry.volatilityIndex}%</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Entanglement</span>
            <div className="text-purple-400 font-mono font-bold text-sm">{telemetry.quantumEntanglementCoeff} ψ</div>
          </div>
        </div>
      </div>

      {/* Main Grid & Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 2D Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
          {/* Controls Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                id="btn-conway-play-pause"
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isRunning ? 'Pause Simulation' : 'Run Simulation'}</span>
              </button>

              <button
                id="btn-conway-step"
                onClick={() => {
                  setGrid(prev => computeNextGen(prev));
                  setGeneration(g => g + 1);
                }}
                disabled={isRunning}
                title="Advance 1 Generation"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition-colors"
              >
                <FastForward className="w-4 h-4" />
              </button>

              <button
                id="btn-conway-reset"
                onClick={handleClear}
                title="Clear Grid"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-conway-random"
                onClick={() => handleRandomSeed(0.2)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
              >
                🎲 Random Chaos
              </button>
            </div>

            {/* Drawing Brush Mode & Speed Slider */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDrawMode('BIRTH')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors ${
                    drawMode === 'BIRTH' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Birth Mode
                </button>
                <button
                  onClick={() => setDrawMode('KILL')}
                  className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors ${
                    drawMode === 'KILL' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kill Mode
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[11px]">Speed:</span>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={550 - speedMs}
                  onChange={(e) => setSpeedMs(550 - Number(e.target.value))}
                  className="w-20 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2D Conway Grid Rendering */}
          <div 
            className="mt-6 p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner select-none cursor-crosshair overflow-auto max-w-full"
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
          >
            <div 
              className="grid gap-[2px] bg-slate-900/60 p-1 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                width: 'min(100%, 540px)',
                height: 'min(100%, 540px)',
                aspectRatio: '1/1'
              }}
            >
              {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onMouseEnter={() => {
                      if (isDrawing) handleCellInteract(rIdx, cIdx);
                    }}
                    onMouseDown={() => handleCellInteract(rIdx, cIdx)}
                    className={`rounded-[2px] transition-colors duration-100 ${
                      cell === 1 
                        ? `${getThemeColor()} shadow-sm` 
                        : 'bg-slate-950/90 hover:bg-slate-800/80'
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Live Insight Bar */}
          {aiInsight && (
            <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/80 border border-cyan-900/40 text-xs text-cyan-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{aiInsight}</span>
            </div>
          )}
        </div>

        {/* Right Sidebar: AI Pattern Synthesizer & Presets */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Pattern Synthesizer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Market Pattern Synthesizer</span>
            </div>
            <p className="text-xs text-slate-400">
              Prompt Gemini to seed cellular coordinates mirroring real market scenarios.
            </p>

            <div className="space-y-2">
              <input
                id="input-ai-conway-prompt"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateAiPattern();
                }}
                placeholder="e.g. Flash crash shockwave with recovery..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <button
                id="btn-generate-ai-conway"
                onClick={handleGenerateAiPattern}
                disabled={!aiPrompt.trim() || isAiGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Lattice...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Generate & Seed Grid</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => {
                  setAiPrompt('Bull market liquidity rush');
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-400 border border-slate-800"
              >
                📈 Bull Liquidity
              </button>
              <button
                onClick={() => {
                  setAiPrompt('DeFi vampire attack drainage');
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-400 border border-slate-800"
              >
                🧛 Vampire Drain
              </button>
              <button
                onClick={() => {
                  setAiPrompt('Quantum entanglement ring');
                }}
                className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-400 border border-slate-800"
              >
                ⚛️ Quantum Ring
              </button>
            </div>
          </div>

          {/* Presets List Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Market Dynamic Presets</h3>
              <span className="text-[11px] text-slate-500">4 Classic Seeds</span>
            </div>

            <div className="space-y-2.5">
              {CONWAY_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {preset.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        {preset.grid.length} cells
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Color Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cell Luminescence Theme</h4>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setTheme('NEON_CYAN')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] ${
                  theme === 'NEON_CYAN' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span>Cyan</span>
              </button>
              <button
                onClick={() => setTheme('QUANTUM_EMERALD')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] ${
                  theme === 'QUANTUM_EMERALD' ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span>Emerald</span>
              </button>
              <button
                onClick={() => setTheme('SOLAR_AMBER')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] ${
                  theme === 'SOLAR_AMBER' ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span>Amber</span>
              </button>
              <button
                onClick={() => setTheme('VOID_PURPLE')}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] ${
                  theme === 'VOID_PURPLE' ? 'border-purple-400 bg-purple-500/20 text-purple-300' : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Purple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
