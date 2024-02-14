const axios = require('axios');
const { ethers } = require('ethers');

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFlMDQ4Njk0LTA2YzMtNDk5Yy05MjI5LWJhNDA3ZjllOTMyNCIsIm9yZ0lkIjoiMzcyNzM0IiwidXNlcklkIjoiMzgzMDU4IiwidHlwZUlkIjoiNmFkYTVmYzktZTBiYS00YjExLWIwOWItZDkwMDA3ZTVhMzFmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDU0NDQ1NzMsImV4cCI6NDg2MTIwNDU3M30.9Zy5nqZIzeWjgbE1zjMQS2woHUlgoe-S0OWeZUbvcAA
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed1.binance.org/")
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed2.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.binance.org/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.binance.org/")
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed1.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed2.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.defibit.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.defibit.io/")
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed1.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed2.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed3.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc-dataseed4.ninicoin.io/")
//const provider = new ethers.JsonRpcProvider("https://bsc.drpc.org");
//const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc");
//const provider = new ethers.JsonRpcProvider("https://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/");
//const provider = new ethers.JsonRpcProvider('https://bsc.meowrpc.com');	
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed.bnbchain.org");
//const provider2 = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
//const provider2 = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider2 = new ethers.WebSocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
const provider2 = new ethers.WebSocketProvider("wss://bsc.publicnode.com");

async function getBytecode(contractAddress) {
    try {
      const Bytecode = await provider2.getCode(contractAddress);
      const slic = await Bytecode.toString()
      const result = slic.slice(0,40);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

 module.exports = {getBytecode};