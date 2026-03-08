# DEX Simulator

Constant-product AMM simulator implementing Uniswap V2 formula. Fetches real-time reserves from Ethereum mainnet and simulates token swaps with slippage calculation.

## Overview

The simulator connects to Ethereum via Viem library, reads live data from USDC-WETH Uniswap V2 pair, and performs fuzz testing with random swap amounts. It demonstrates how slippage behaves based on trade size relative to pool liquidity.

## Project Structure

```
dex-simulator/
├── src/
│   ├── index.js                      # Main entry point
│   ├── config/
│   │   └── constants.js              # Configuration constants
│   ├── abi/
│   │   ├── uniswapV2Pair.abi.json   # Uniswap V2 pair ABI
│   │   └── erc20.abi.json            # ERC20 token ABI
│   ├── modules/
│   │   ├── DEXSimulator.js           # AMM swap calculation logic
│   │   └── BlockchainProvider.js     # Ethereum blockchain interaction
│   └── utils/
│       ├── helpers.js                # Helper functions
│       ├── statistics.js             # Statistics calculation
│       └── display.js                # Console output formatting
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Usage

Run with default settings (10 random tests, 100-100,000 USDC):
```bash
npm start
```

Run with custom parameters:
```bash
node src/index.js [testCount] [minAmount] [maxAmount]

# Examples:
node src/index.js 20 1000 50000    # 20 tests from 1,000 to 50,000 USDC
node src/index.js 5 10 1000        # 5 tests from 10 to 1,000 USDC
```

## Formula

**Constant-product invariant:**
```
x * y = k
```
Where `x` and `y` are token reserves, and `k` must remain constant after each swap.

**Swap output calculation:**
```
amountInWithFee = amountIn * (1 - 0.003)
amountOut = (reserveB * amountInWithFee) / (reserveA + amountInWithFee)
```
The 0.3% fee is subtracted before calculating output.

**Slippage calculation:**
```
initialPrice = reserveB / reserveA
effectivePrice = amountOut / amountIn
slippage = ((initialPrice - effectivePrice) / initialPrice) * 100
```

## Test Results

Example results from real Ethereum data:

| Input (USDC) | Output (WETH) | Slippage | Effective Price |
|--------------|---------------|----------|-----------------|
| 1,000        | 0.503         | 0.31%    | 0.000503        |
| 10,000       | 5.025         | 0.41%    | 0.000503        |
| 100,000      | 49.762        | 1.38%    | 0.000498        |

Pool reserves: 9,108,750 USDC / 4,596 WETH  
Block: 24606692

## Conclusions

- **Non-linear slippage**: Slippage doesn't scale linearly with trade size. A 10x larger trade doesn't mean 10x more slippage.
- **Small trades are efficient**: Trades under 1% of pool size experience minimal slippage (< 0.5%), making them cost-effective.
- **Large trades have significant impact**: Trades over 1% of pool reserves face substantial price impact (> 1%), which grows exponentially with size.

## Technical Details

- **Blockchain**: Ethereum Mainnet
- **Library**: Viem v2.21+
- **RPC**: LlamaRPC public endpoint
- **Contract**: Uniswap V2 USDC-WETH Pair (`0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc`)
- **Fee**: 0.3% swap fee

## API Reference

**BlockchainProvider**
```javascript
const provider = new BlockchainProvider();
await provider.getReserves(pairAddress);  // Fetch reserves from pair
await provider.getTokenInfo(tokenAddress); // Get token symbol/decimals/name
await provider.getBlockNumber();           // Get current block
```

**DEXSimulator**
```javascript
const dex = new DEXSimulator(reserveA, reserveB, 0.003);
dex.swap('AtoB', amountIn);       // Calculate swap (doesn't modify state)
dex.executeSwap('AtoB', amountIn); // Execute and update reserves
dex.reset();                       // Reset to initial reserves
```  
