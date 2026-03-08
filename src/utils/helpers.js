const DEXSimulator = require('../modules/DEXSimulator');
const { DEFAULT_FEE } = require('../config/constants');

function generateRandomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runSwapSimulation(pairData, amountIn) {
    const dex = new DEXSimulator(pairData.reserve0, pairData.reserve1, DEFAULT_FEE);
    const result = dex.swap('AtoB', amountIn);
    
    console.log('='.repeat(70));
    console.log(`Swap: ${amountIn.toLocaleString()} ${pairData.token0.symbol}`);
    console.log('='.repeat(70));
    console.log(`Input:  ${amountIn.toLocaleString()} ${pairData.token0.symbol}`);
    console.log(`Output: ${result.amountOut.toFixed(6)} ${pairData.token1.symbol}`);
    console.log(`Slippage: ${result.slippage}`);
    console.log(`Effective Price: ${result.effectivePrice.toFixed(6)}`);
    
    return result;
}

module.exports = {
    generateRandomAmount,
    runSwapSimulation
};
