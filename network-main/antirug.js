require('dotenv').config();
const ethers = require("ethers");
const key = require("../bot/telegram")
const botWalletKey = key.botWalletKey
const swap = require("./swap");

//const provider = new ethers.providers.JsonRpcProvider("https://bsc-testnet.publicnode.com");

const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")
//const provider2 = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider = new ethers.providers.WebSocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
//const provider2 = new ethers.providers.WebSocketProvider("wss://bsc.publicnode.com");
const wallet = new ethers.Wallet(botWalletKey,provider);
const account = wallet.connect(provider)



const ERC20_ABI = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
]

const antirug = async(pair,token) => {
  const erc20 = new ethers.Contract(pair,ERC20_ABI,account);
   erc20.on('Transfer', async(from,to,amount)=>{
     if(from == pair){
       await swap.sell(token)
     }  
   })
}
module.exports = {antirug}