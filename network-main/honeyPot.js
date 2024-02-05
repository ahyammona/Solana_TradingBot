const axios = require('axios');
const { ethers } = require('ethers');

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFlMDQ4Njk0LTA2YzMtNDk5Yy05MjI5LWJhNDA3ZjllOTMyNCIsIm9yZ0lkIjoiMzcyNzM0IiwidXNlcklkIjoiMzgzMDU4IiwidHlwZUlkIjoiNmFkYTVmYzktZTBiYS00YjExLWIwOWItZDkwMDA3ZTVhMzFmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDU0NDQ1NzMsImV4cCI6NDg2MTIwNDU3M30.9Zy5nqZIzeWjgbE1zjMQS2woHUlgoe-S0OWeZUbvcAA
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/bsc")

async function getBytecode(contractAddress) {
    try {
      const Bytecode = provider.getCode(contractAddress);
      const slic = (await Bytecode).toString()
      const result = slic.slice(0,40);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

 module.exports = {getBytecode};