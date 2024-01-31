require('dotenv').config();
const main = require('../main');
const five = require('../oneX/five');
const telegram = require('../bot/telegram');
const web3 = require('../wallet/bsc')
const ethers = require("ethers");
const swap = require("../network-main/swap");
const rug = require("../network-main/antirug");

let token;
let trade = true;
let purchase = 0;
const msgId = telegram.msgId;
const erc20 = web3.erc20;
let buys = 0;
const factory = web3.factory;

const bscFactory = ()=> {
return(   
factory.on("PairCreated", async (token0, token1, addressPair) => { 
    console.log('listening to New Pair On Binance')
    rug.antiRug(addressPair,addressPair);
    telegram.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      if(msg.text == 'sell'){
         await telegram.bot.sendMessage(chatId, `selling ${token}`);
         await web3.approve(token);
         await swap.sell(token);
         telegram.bot.sendMessage(msgId,`SOLD ${token} with Pair ${addressPair}`)
         purchase -= 1;
      }
    });
    const IMMUTABLEBALANCE = await erc20.balanceOf(addressPair);
    const balanceOfPair = parseInt(ethers.utils.formatEther(IMMUTABLEBALANCE));
     await telegram.bot.sendMessage(msgId,
        main.pairAlert(token0,token1,addressPair,balanceOfPair)
     )
  //if balanceOfPair is greater than the minimum liquidity
    if(trade){
         await telegram.bot.sendMessage(msgId,
         main.potentialBuy(token0,token1,addressPair,balanceOfPair)
      )
     
      //listen to buys
       erc20.on("Transfer", async(from,to,amount)=>{
         rug.antiRug(addressPair,addressPair);  
            if(to == addressPair){
                    //five
               if(trade &&
                  five.one_x_fiveLP === null ||
                  five.otherLp != 0  &&
                  balanceOfPair >= 20 
                   )
                   {
                     if(token0 == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'){
                        token = token1;
                     }else{
                        token = token0;
                     }
                       await swap.buy(token);
                        purchase +1;
                        telegram.bot.sendMessage(msgId,`Purchased ${token} with Pair ${addressPair}`)
                     
                    five.one_x_fiveLP = addressPair;
                    trade = false;
                    five.otherLp = 0;
                    //buy
                    await telegram.bot.sendMessage(msgId,
                    five.fiveMessage(addressPair,ethers.utils.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                  )
                  console.log(five.fiveMessage(addressPair,ethers.utils.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                  )
                    erc20.on("Transfer", async(from,to,amount)=>{
                     rug.antiRug(addressPair,five.one_x_fiveLP);  
                     if(to == five.one_x_fiveLP){                          
                      const CurrentBalance = await erc20.balanceOf(addressPair);
                      const Prof = Number(CurrentBalance).toFixed(3) / Number(IMMUTABLEBALANCE).toFixed(3);
                      buys = buys + 1;
                      telegram.bot.sendMessage(msgId,
                      five.fiveBoughtMessage(addressPair,ethers.utils.formatEther(amount),balanceOfPair,ethers.utils.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                      )
                      console.log(five.fiveBoughtMessage(addressPair,ethers.utils.formatEther(amount),balanceOfPair,ethers.utils.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                     )
                     if(Prof > five.one_x_five){
                        five.otherLp = 1;
                        telegram.bot.sendMessage(msgId,
                        five.fiveHitMessage(addressPair,balanceOfPair,five.one_x_five,balanceOfPair))
                        trade = true;
                        profitHit = true
                        await web3.approve(token);
                        await swap.sell(token);
                        
                        telegram.bot.sendMessage(msgId,`SOLD ${token} with Pair ${addressPair}`)
                        purchase -= 1;
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

module.exports = {bscFactory,token}