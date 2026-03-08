const BlockchainProvider = require('./modules/BlockchainProvider');
const { generateRandomAmount, runSwapSimulation } = require('./utils/helpers');
const { calculateStatistics } = require('./utils/statistics');
const { 
    printHeader, 
    printConnectionInfo, 
    printPairInfo, 
    printPoolData, 
    printTestingInfo, 
    printSummaryTable, 
    printInsights,
    printError 
} = require('./utils/display');
const { 
    USDC_WETH_PAIR, 
    DEFAULT_TEST_COUNT, 
    DEFAULT_MIN_AMOUNT, 
    DEFAULT_MAX_AMOUNT 
} = require('./config/constants');

async function main(testCount = DEFAULT_TEST_COUNT, minAmount = DEFAULT_MIN_AMOUNT, maxAmount = DEFAULT_MAX_AMOUNT) {
    try {
        printHeader();
        
        const provider = new BlockchainProvider();
        const blockNumber = await provider.getBlockNumber();
        printConnectionInfo(blockNumber);
        
        printPairInfo(USDC_WETH_PAIR);
        const pairData = await provider.getReserves(USDC_WETH_PAIR);
        
        printPoolData(pairData);
        printTestingInfo(testCount, minAmount, maxAmount, pairData.token0.symbol);
        
        const results = [];
        for (let i = 0; i < testCount; i++) {
            const randomAmount = generateRandomAmount(minAmount, maxAmount);
            const result = await runSwapSimulation(pairData, randomAmount);
            results.push(result);
        }
        
        printSummaryTable(results);
        
        const statistics = calculateStatistics(results);
        printInsights(testCount, minAmount, maxAmount, pairData.token0.symbol, statistics, pairData, blockNumber);
        
    } catch (error) {
        console.error('Error:', error.message);
        printError();
        process.exit(1);
    }
}

if (require.main === module) {
    const testCount = parseInt(process.argv[2]) || DEFAULT_TEST_COUNT;
    const minAmount = parseInt(process.argv[3]) || DEFAULT_MIN_AMOUNT;
    const maxAmount = parseInt(process.argv[4]) || DEFAULT_MAX_AMOUNT;
    
    main(testCount, minAmount, maxAmount);
}

module.exports = { main };
