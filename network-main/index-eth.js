require('dotenv').config();
const express = require("express");
const main = require('../main');
const five = require('../oneX/arbFive');
const telegram = require('../bot/telegram');
const web3 = require('../wallet/eth')
const ethers = require("ethers");


let trade = true;
const msgId = telegram.msgId;
const erc20 = web3.erc20;
let buys = 0;
const factory = web3.factory;

const arbFactory = ()=> {
return(   
factory.on("PairCreated", async (token0, token1, addressPair) => {
    console.log('listening to New Pair on Ethereum')
    const IMMUTABLEBALANCE = await erc20.balanceOf(addressPair);
    const balanceOfPair = parseInt(ethers.formatEther(IMMUTABLEBALANCE));
     await telegram.bot.sendMessage(msgId,
        main.pairAlert(token0,token1,addressPair,balanceOfPair)
     )
  //if balanceOfPair is greater than the minimum liquidity
    if(trade  && IMMUTABLEBALANCE > 50){
         await telegram.bot.sendMessage(msgId,
         main.potentialBuy(token0,token1,addressPair,balanceOfPair)
      )
     
      //listen to buys
       erc20.on("Transfer", async(from,to,amount)=>{  
            if(to == addressPair){
                    //five
               if(trade &&
                  five.one_x_fiveLP === null ||
                  five.otherLp != 0  &&
                  IMMUTABLEBALANCE > 50 
                   )
                   {
                    five.one_x_fiveLP = addressPair;
                    trade = false;
                    five.otherLp = 0;
                    //buy
                    await telegram.bot.sendMessage(msgId,
                    five.fiveMessage(addressPair,ethers.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                  )
                  console.log(five.fiveMessage(addressPair,ethers.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                  )
                    erc20.on("Transfer", async(from,to,amount)=>{
                     if(to == five.one_x_fiveLP){                         
                      const CurrentBalance = await erc20.balanceOf(addressPair);
                      const Prof = Number(CurrentBalance).toFixed(3) / Number(IMMUTABLEBALANCE).toFixed(3);
                      buys = buys + 1;
                      telegram.bot.sendMessage(msgId,
                      five.fiveBoughtMessage(addressPair,ethers.formatEther(amount),balanceOfPair,ethers.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                      )
                      console.log(five.fiveBoughtMessage(addressPair,ethers.formatEther(amount),balanceOfPair,ethers.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                     )
                     if(Prof > five.one_x_five){
                        five.otherLp = 1;
                        telegram.bot.sendMessage(msgId,
                        five.fiveHitMessage(addressPair,balanceOfPair,five.one_x_five,balanceOfPair))
                        trade = true;
                        profitHit = true
                        
                     }
                 }  
             })
           }         
        }
     })
   }
 })
)
}

module.exports = {arbFactory}