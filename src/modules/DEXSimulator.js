// Constant-Product AMM Simulator (x * y = k)
class DEXSimulator {
    constructor(reserveA, reserveB, fee = 0.003) {  
        this.reserveA = reserveA;
        this.reserveB = reserveB;
        this.fee = fee;
        this.initialReserveA = reserveA;
        this.initialReserveB = reserveB;
    }

    updateReserves(reserveA, reserveB) {
        this.reserveA = reserveA;
        this.reserveB = reserveB;
    }

    getInitialPrice() {
        return this.reserveB / this.reserveA;
    }

    getReserves() {
        return {
            reserveA: this.reserveA,
            reserveB: this.reserveB
        };
    }

    // Core swap logic using constant-product formula
    swap(direction, amountIn) {
        let amountOut, newReserveA, newReserveB, effectivePrice, initialPrice, slippage;

        if (direction === 'AtoB') {
            initialPrice = this.reserveB / this.reserveA;
            const amountInWithFee = amountIn * (1 - this.fee);
            
            // Formula: amountOut = (reserveB * amountInWithFee) / (reserveA + amountInWithFee)
            amountOut = (this.reserveB * amountInWithFee) / (this.reserveA + amountInWithFee);
            
            newReserveA = this.reserveA + amountIn;
            newReserveB = this.reserveB - amountOut;
            effectivePrice = amountOut / amountIn;
            
        } else if (direction === 'BtoA') {
            initialPrice = this.reserveA / this.reserveB;
            const amountInWithFee = amountIn * (1 - this.fee);
            amountOut = (this.reserveA * amountInWithFee) / (this.reserveB + amountInWithFee);
            
            newReserveA = this.reserveA - amountOut;
            newReserveB = this.reserveB + amountIn;
            effectivePrice = amountOut / amountIn;
            
        } else {
            throw new Error('Invalid direction. Use "AtoB" or "BtoA"');
        }

        slippage = ((initialPrice - effectivePrice) / initialPrice) * 100;

        return {
            amountIn,
            amountOut,
            direction,
            oldReserveA: this.reserveA,
            oldReserveB: this.reserveB,
            newReserveA,
            newReserveB,
            initialPrice,
            effectivePrice,
            slippage: slippage.toFixed(2) + '%',
            slippageValue: slippage
        };
    }
    
    executeSwap(direction, amountIn) {
        const result = this.swap(direction, amountIn);
        this.reserveA = result.newReserveA;
        this.reserveB = result.newReserveB;
        return result;
    }

    reset() {
        this.reserveA = this.initialReserveA;
        this.reserveB = this.initialReserveB;
    }

    static printResult(result) {
        console.log('\n' + '='.repeat(60));
        console.log(`Swap Result: ${result.direction}`);
        console.log('='.repeat(60));
        console.log(`Input Amount:       ${result.amountIn.toFixed(4)}`);
        console.log(`Output Amount:      ${result.amountOut.toFixed(4)}`);
        console.log(`Initial Price:      ${result.initialPrice.toFixed(6)}`);
        console.log(`Effective Price:    ${result.effectivePrice.toFixed(6)}`);
        console.log(`  Slippage:           ${result.slippage}`);
        console.log('-'.repeat(60));
        console.log(`Reserves: A: ${result.oldReserveA.toFixed(2)} → ${result.newReserveA.toFixed(2)}`);
        console.log(`          B: ${result.oldReserveB.toFixed(2)} → ${result.newReserveB.toFixed(2)}`);
        console.log('='.repeat(60) + '\n');
    }
}

module.exports = DEXSimulator;
