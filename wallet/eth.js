require('dotenv').config();
const ethers = require("ethers");
const key = require("../bot/telegram")
const botWalletKey = key.botWalletKey

const addresses = {
    WBNB: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    me: key.botPublic,
    myAddress : key.botWalletAddress
}

const provider2 = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/b3a9dea8f5654645b721a31461e580cb")
//const provider2 = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider = new ethers.WebSocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
//const provider = new ethers.WebSocketProvider("wss://arb-mainnet.g.alchemy.com/v2/SD2wtO_U3PMQTZO_3Hsqbyxhc8a9XqeM");
const wallet = new ethers.Wallet(botWalletKey,provider2);
const account = wallet.connect(provider2)



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


const erc20 = new ethers.Contract(addresses.WBNB,ERC20_ABI,provider2);

// const myBal = async() =>{
//     const mybal = await erc20.balanceOf(addresses.myAddress)
//     console.log(mybal)
// }
//   myBal();
  const amountIn = ethers.utils.parseUnits('0.1', 'ether'); //ether is the measurement, not the coin
    // // math for Big numbers in JS
 
    // const tx = async (token1, token2) => {
    //     const amountIn = ethers.parseUnits('0.1', 'ether'); //ether is the measurement, not the coin
    //     const amounts = await router.getAmountsOut(amountIn, [buyToken, sellToken]);
    //     console.log(`
    //     ~~~~~~~~~~~~~~~~~~~~
    //     Buying new token
    //     ~~~~~~~~~~~~~~~~~~~~
    //     buyToken: ${amountIn.toString()} ${buyToken} (WBNB)
    //     sellToken: ${amountOutMin.toString()} ${sellToken}
    //     `);
    //     return(
    //     await router.swapExactTokensForTokens(
    //     amountIn,
    //     amountOutMin,
    //     [token1, token2],
    //     addresses.me,
    //     Date.now() + 1000 * 60 * 5 //5 minutes
    //     )
    //  ) 
    // };
   // const receipt = await tx.wait();
   // console.log('Transaction receipt');
module.exports = {factory,  erc20}