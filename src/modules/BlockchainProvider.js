const { createPublicClient, http, formatUnits } = require('viem');
const { mainnet } = require('viem/chains');
const uniswapV2PairABI = require('../abi/uniswapV2Pair.abi.json');
const erc20ABI = require('../abi/erc20.abi.json');

class BlockchainProvider {
    constructor(rpcUrl = null) {
        this.client = createPublicClient({
            chain: mainnet,
            transport: http(rpcUrl || 'https://eth.llamarpc.com')
        });

        this.pairABI = uniswapV2PairABI;
        this.erc20ABI = erc20ABI;
    }

    async getReserves(pairAddress) {
        try {
            const reserves = await this.client.readContract({
                address: pairAddress,
                abi: this.pairABI,
                functionName: 'getReserves'
            });

            const [token0Address, token1Address] = await Promise.all([
                this.client.readContract({
                    address: pairAddress,
                    abi: this.pairABI,
                    functionName: 'token0'
                }),
                this.client.readContract({
                    address: pairAddress,
                    abi: this.pairABI,
                    functionName: 'token1'
                })
            ]);

            const [token0Info, token1Info] = await Promise.all([
                this.getTokenInfo(token0Address),
                this.getTokenInfo(token1Address)
            ]);

            const reserve0 = Number(formatUnits(reserves[0], token0Info.decimals));
            const reserve1 = Number(formatUnits(reserves[1], token1Info.decimals));

            return {
                reserve0,
                reserve1,
                token0: {
                    address: token0Address,
                    ...token0Info
                },
                token1: {
                    address: token1Address,
                    ...token1Info
                },
                blockTimestamp: Number(reserves[2]),
                pairAddress
            };
        } catch (error) {
            console.error('Error fetching reserves:', error);
            throw error;
        }
    }

    async getTokenInfo(tokenAddress) {
        try {
            const [symbol, decimals, name] = await Promise.all([
                this.client.readContract({
                    address: tokenAddress,
                    abi: this.erc20ABI,
                    functionName: 'symbol'
                }),
                this.client.readContract({
                    address: tokenAddress,
                    abi: this.erc20ABI,
                    functionName: 'decimals'
                }),
                this.client.readContract({
                    address: tokenAddress,
                    abi: this.erc20ABI,
                    functionName: 'name'
                })
            ]);

            return { symbol, decimals, name };
        } catch (error) {
            console.error('Error fetching token info:', error);
            throw error;
        }
    }

    async getBlockNumber() {
        return await this.client.getBlockNumber();
    }
}

module.exports = BlockchainProvider;
