const ethers = require("ethers");
const swap = require('./swap');

const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.ninicoin.io/");

const ERC20_ABI = [
  "function name() view returns(string)",
  "function symbol() view returns(string)",
  "function totalSupply() view returns(uint256)",
  "function balanceOf(address) view returns(uint)",
  "function owner() view returns(address)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
]

async function getPendingRemoveLiquidityTransactions(pairAddress, token) {
  const erc20 = new ethers.Contract(token,ERC20_ABI,provider);
  try {
   await  erc20.on("Transfer", async(from,to,amount)=>{
      if(from === pairAddress){
        console.log(`Pending remove liquidity transactions for token at ${token} for contract at ${pairAddress}:`);
      }
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = {getPendingRemoveLiquidityTransactions};