function printHeader() {
    console.log('DEX Simulator - Fuzz Testing with Random Amounts\n');
    console.log('='.repeat(70));
}

function printConnectionInfo(blockNumber) {
    console.log('Connecting to Ethereum mainnet...');
    console.log(`Connected! Current block: ${blockNumber}\n`);
}

function printPairInfo(pairAddress) {
    console.log('Fetching reserves from Uniswap V2 USDC-WETH pair...');
    console.log(`Contract: ${pairAddress}\n`);
}

function printPoolData(pairData) {
    console.log('='.repeat(70));
    console.log('LIVE POOL DATA');
    console.log('='.repeat(70));
    console.log(`Token 0: ${pairData.token0.symbol} (${pairData.token0.name})`);
    console.log(`Address: ${pairData.token0.address}`);
    console.log(`Reserve: ${pairData.reserve0.toLocaleString()} ${pairData.token0.symbol}`);
    console.log('');
    console.log(`Token 1: ${pairData.token1.symbol} (${pairData.token1.name})`);
    console.log(`Address: ${pairData.token1.address}`);
    console.log(`Reserve: ${pairData.reserve1.toLocaleString()} ${pairData.token1.symbol}`);
    console.log('');
    console.log(`Price: 1 ${pairData.token0.symbol} = ${(pairData.reserve1 / pairData.reserve0).toFixed(6)} ${pairData.token1.symbol}`);
    console.log(`Price: 1 ${pairData.token1.symbol} = ${(pairData.reserve0 / pairData.reserve1).toFixed(2)} ${pairData.token0.symbol}`);
    console.log('='.repeat(70));
}

function printTestingInfo(testCount, minAmount, maxAmount, tokenSymbol) {
    console.log(`\nFUZZ TESTING: Running ${testCount} random swaps (${minAmount}-${maxAmount} ${tokenSymbol})\n`);
}

function printSummaryTable(results) {
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY TABLE');
    console.log('='.repeat(70));
    console.log('Swap Size'.padEnd(20) + 
                'Output'.padEnd(20) + 
                'Slippage'.padEnd(15) + 
                'Eff. Price');
    console.log('-'.repeat(70));
    
    const sortedResults = [...results].sort((a, b) => a.amountIn - b.amountIn);
    
    sortedResults.forEach(result => {
        console.log(`${result.amountIn.toLocaleString()} USDC`.padEnd(20) + 
                    `${result.amountOut.toFixed(6)} WETH`.padEnd(20) + 
                    result.slippage.padEnd(15) + 
                    result.effectivePrice.toFixed(6));
    });
    
    console.log('='.repeat(70));
}

function printInsights(testCount, minAmount, maxAmount, tokenSymbol, statistics, pairData, blockNumber) {
    console.log('\nKEY INSIGHTS:');
    console.log(`1. Tested ${testCount} random swap amounts from ${minAmount} to ${maxAmount} ${tokenSymbol}`);
    console.log(`2. Average slippage: ${statistics.avgSlippage.toFixed(2)}%`);
    console.log(`3. Slippage range: ${statistics.minSlippage.toFixed(2)}% to ${statistics.maxSlippage.toFixed(2)}%`);
    console.log(`4. Pool reserves: ${pairData.reserve0.toLocaleString()} ${pairData.token0.symbol} / ${pairData.reserve1.toLocaleString()} ${pairData.token1.symbol}`);
    console.log(`5. Block: ${blockNumber}\n`);
}

function printError() {
    console.error('Make sure you have:');
    console.error('1. Installed dependencies: npm install');
    console.error('2. Internet connection to access Ethereum RPC');
}

module.exports = {
    printHeader,
    printConnectionInfo,
    printPairInfo,
    printPoolData,
    printTestingInfo,
    printSummaryTable,
    printInsights,
    printError
};
