require('dotenv').config();
const ethers = require("ethers");
const key = require("../bot/telegram")
const botWalletKey = key.botWalletKey

const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    me: key.botPublic,
    myAddress : key.botWalletAddress
}

const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed2.binance.org/
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed2.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed2.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc.drpc.org");
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc");
//const provider = new ethers.JsonRpcProvider("https://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/");
//const provider = new ethers.JsonRpcProvider('https://bsc.meowrpc.com');	
const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed.bnbchain.org");
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider2 = new ethers.WebSocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
//const provider2 = new ethers.WebSocketProvider("wss://bsc.publicnode.com");

const wallet = new ethers.Wallet(botWalletKey,provider2);
const account = wallet.connect(provider2)
const approval = wallet.connect(provider)


const factory = new ethers.Contract(
    addresses.factory,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
);

const ERC20_ABI = [
    "function name() view returns(string)",
    "function symbol() view returns(string)",
    "function totalSupply() view returns(uint256)",
    "function balanceOf(address) view returns(uint)",
    "function owner() view returns(address)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
]

const approve = async(token) => {
    const erc20 = new ethers.Contract(token,ERC20_ABI,approval);
  
    const amountIn = await erc20.balanceOf(addresses.me);
    await erc20.approve(addresses.router,amountIn + amountIn);
}
const erc20 = new ethers.Contract(addresses.WBNB,ERC20_ABI,provider);
 
module.exports = {factory,  erc20,approve}