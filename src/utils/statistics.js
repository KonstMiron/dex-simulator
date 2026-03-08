function calculateStatistics(results) {
    const avgSlippage = results.reduce((sum, r) => sum + r.slippageValue, 0) / results.length;
    const minSlippage = Math.min(...results.map(r => r.slippageValue));
    const maxSlippage = Math.max(...results.map(r => r.slippageValue));

    return {
        avgSlippage,
        minSlippage,
        maxSlippage
    };
}

module.exports = {
    calculateStatistics
};
