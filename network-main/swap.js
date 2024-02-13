require('dotenv').config();
const ethers = require("ethers");
const key = require("../bot/telegram");
const { erc20 } = require('../wallet/bsc');
const addresses = {
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", //0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", //0xD99D1c33F9fC3444f8101754aBC46c52416550D1
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", //0x6725F303b657a9451d8BA641348b6761A6CC7a17
    me: "0xF4b39FB6B4bC827fD34a79E8a1e048EF5b21Ba81"
}

//const provider = new ethers.SocketProvider("wss://bsc.publicnode.com");
//const provider = new ethers.JsonRpcProvider("https://bsc-testnet.publicnode.com");
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel/47ceb5ecaf80725d3285c7fc84df4f4a0153c6718ea8542f0c702c975b255779");
//mainnet
const provider = new ethers.JsonRpcProvider("https://bsc.publicnode.com");
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc")
//const provider = new ethers.SocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider = new ethers.WebSocketProvider("wss://bsc.publicnode.com/")
//const provider = new ethers.WebSocketProvider("wss://go.getblock.io/46120e1a3d3847f680e0c4243efcb67c ");
const wallet = new ethers.Wallet('0xab17a6d0cbcc7aa7a05f93f07aef9cd80da40a9f6104d82d358951469ecae4ad',provider);
const account = wallet.connect(provider)
//const signer =  provider.getSigner(account.address);


const router = new ethers.Contract(
    addresses.router,
    [
        "function getAmountsOut(uint amountIn, address[] memory path) public view  returns (uint[] amounts)",
        "function swapExactETHForTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) external payable returns (uint[] memory amounts)",
        "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external",    ],
    account
);

const ERC20_ABI = [
    "function name() view returns(string)",
    "function symbol() view returns(string)",
    "function totalSupply() view returns(uint256)",
    "function approve(address spender, uint amount) returns(bool)",
    "function balanceOf(address) view returns(uint)",
    "function owner() view returns(addrss)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
]

//const erc20 = new ethers.Contract(addresses.WBNB,ERC20_ABI,account);

// math for Big numbers in JS

const buy = async (token) => {
    const amount = 0.01843;
    const amountIn = ethers.parseUnits(amount.toString(), 'ether'); //ether is the measurement, not the coin
    const amounts = await router.getAmountsOut(amountIn, [addresses.WBNB, token]);
    const amountOutMin = Number(amounts[1]) - (Number(amounts[1]) / 10); // math for Big numbers in JS



 
    var options = {
        gasPrice: ethers.parseUnits('10','gwei'),
        gasLimit: 250000,
        value: amountIn
     };
   try{ 
    const transaction = await router.swapExactETHForTokens(
        0,
        [addresses.WBNB, token],
        addresses.me,
        Date.now() + 1000 * 60 * 5, //5 minutes
        options
    )
    console.log(`Transaction Confirm: ${transaction.hash}`);

  } catch (error) {
    if (error.code === -32000 && error.message === 'already known') {
      console.log('Transaction already known, ignoring error');
    } else {
      console.error('Unexpected error:', error);
    }
  }
};
const sell = async (token) => {
  
  const erc20 = new ethers.Contract(token,ERC20_ABI,account);
  const amountIn = await erc20.balanceOf(addresses.me)
  await erc20.approve(addresses.router,amountIn + amountIn);
  const amounts = await router.getAmountsOut(amountIn, [token,addresses.WBNB]);
  //const amountOutMin = BigInt(amounts[1])  - BigInt(amounts[1] / BigInt(100) * BigInt(15)); // math for Big numbers in JS


  try{ 
  var options = {
      gasPrice: ethers.parseUnits('30','gwei'),
      gasLimit: 250000
   };
  const transaction = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
      BigInt(amountIn),
      0,
      [token, addresses.WBNB],
      addresses.me,
      Date.now() + 1000 * 60 * 5, //5 minutes
      options
  )
  
  console.log(`Transaction Confirm: ${transaction.hash}`);
} catch (error) {
  if (error.code === -32000 && error.message === 'already known') {
    console.log('Transaction already known, ignoring error');
   } else {
     console.error('Unexpected error:', error);
   }
 }
};


module.exports = {buy,sell};