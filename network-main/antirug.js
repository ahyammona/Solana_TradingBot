const axios = require('axios');
const swap = require('./swap');

async function getPendingRemoveLiquidityTransactions(pairAddress, tokenAddress) {
  try {
    const response = await axios.get(`https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=latest&toBlock=latest&address=${pairAddress}&topic0=0x78a07f0249c1e7a08e32a7a00f11a4d59474a72d&topic1=${tokenAddress}&apikey=7HJ28MPDINE9E3DKG2WFE3STPZHCBB365D`);
    const logs = response.data.result;
    //await swap.sell(tokenAddress);
    console.log(`Pending remove liquidity transactions for token at ${tokenAddress} for contract at ${pairAddress}:`, logs);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {getPendingRemoveLiquidityTransactions};