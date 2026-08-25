import { AutomatonPreset } from '../types';

export const CONWAY_PRESETS: AutomatonPreset[] = [
  {
    id: 'preset-glider-gun',
    name: 'Gosper Glider Gun (Market Maker Pulse)',
    description: 'Continuous stream of localized liquidity impulses driving steady market volume across price tiers.',
    patternType: 'GOSPER',
    marketEffect: 'Generates periodic buy/sell order micro-bursts with stable low volatility.',
    grid: [
      [24, 0], [22, 1], [24, 1], [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3], [0, 4], [1, 4], [10, 4],
      [16, 4], [20, 4], [21, 4], [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5],
      [22, 5], [24, 5], [10, 6], [16, 6], [24, 6], [11, 7], [15, 7], [12, 8], [13, 8]
    ]
  },
  {
    id: 'preset-pulsar',
    name: 'Liquidity Pulsar (Volatility Engine)',
    description: 'Period-3 oscillator creating expanding and contracting liquidity boundaries.',
    patternType: 'PULSAR',
    marketEffect: 'Oscillating bid-ask spreads reflecting cyclical options expiry or macro news cycles.',
    grid: [
      [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
      [0, 2], [5, 2], [7, 2], [12, 2],
      [0, 3], [5, 3], [7, 3], [12, 3],
      [0, 4], [5, 4], [7, 4], [12, 4],
      [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
      [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
      [0, 8], [5, 8], [7, 8], [12, 8],
      [0, 9], [5, 9], [7, 9], [12, 9],
      [0, 10], [5, 10], [7, 10], [12, 10],
      [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
    ]
  },
  {
    id: 'preset-shockwave',
    name: 'Flash Crash Shockwave (Cascade Breeder)',
    description: 'High-density seed with 200+ generations of chaotic expansion simulating systemic liquidation cascades.',
    patternType: 'MARKET_SHOCKWAVE',
    marketEffect: 'Extreme volatility spike, rapid orderbook clearing, followed by asymptotic recovery.',
    grid: [
      [1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]
    ]
  },
  {
    id: 'preset-quantum-lattice',
    name: 'Quantum Superposition Lattice',
    description: 'Orthogonal wave fronts colliding into intricate, self-stabilizing multi-ring crystallizations.',
    patternType: 'QUANTUM_LATTICE',
    marketEffect: 'Zero-slippage algorithmic market-making topology resilient to MEV front-running.',
    grid: [
      [0, 0], [1, 0], [2, 0], [5, 0], [6, 0], [7, 0],
      [0, 2], [2, 2], [5, 2], [7, 2],
      [0, 3], [2, 3], [5, 3], [7, 3],
      [0, 4], [2, 4], [5, 4], [7, 4],
      [0, 6], [1, 6], [2, 6], [5, 6], [6, 6], [7, 6]
    ]
  }
];
