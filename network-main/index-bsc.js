require('dotenv').config();
const main = require('../main');
const five = require('../oneX/five');
const telegram = require('../bot/telegram');
const web3 = require('../wallet/bsc');
const ethers = require("ethers");
const honey = require('./honeyPot');
const swap = require("../network-main/swap");
const rug = require("../network-main/antirug");
const addons = require("../oneX/require");

let buyNumber = 0;
let lastbuys = [];
let trade = true;
let count = 0;
let potentialTokens;
let soldTokens;
let token;
const msgId = telegram.msgId;
const erc20 = web3.erc20;
let profitHit;
let buys = 0;
const factory = web3.factory;

const bscFactory = ()=> {
return(   
  factory.on("PairCreated", async (token0, token1, addressPair) => { 
    console.log('listening to New Pair On Binance')
      telegram.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      if(msg.text == 'sell'){
         try{
         await telegram.bot.sendMessage(chatId, `selling ${token}`);
         //await web3.approve(token);
         //await swap.sell(token);\        
         trade = true;
         count = count - 1;
         soldTokens = token;
         telegram.bot.sendMessage(msgId,`SOLD ${token} with Pair ${addressPair}`)
         }catch (error){
            console.log(error)
         }
   }
    });
    const IMMUTABLEBALANCE = await erc20.balanceOf(addressPair);
    const balanceOfPair = parseInt(ethers.formatEther(IMMUTABLEBALANCE));
    if(balanceOfPair > 10){
        if(trade === true){
         potentialTokens = addressPair;
        }
         await telegram.bot.sendMessage(msgId,
         main.potentialBuy(token0,token1,addressPair,balanceOfPair)
      )
      //listen to buys
       erc20.on("Transfer", async(from,to,amount)=>{ 
            if(to == addressPair
                && trade == true &&
                soldTokens !== addressPair
                ){  //five
                   {
                     if(token0 == '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'){
                        token = token1;
                     }else{
                        token = token0;
                     }
                     if(lastbuys[count - 2] == addressPair){
                        console.log("Token Already Bought")
                     }else{
                     let potCount;
                     const tokenTarget = "0xCb173460EF9C54dA4EA913273D947f40fEB224ED"
                     let target = '0x608060405234801561001057600080fd5b5060';
                     const tokenA = await honey.getBytecode(token);
                     if(tokenA == target && potCount < 1){
                        telegram.bot.sendMessage(msgId,`Honey Pot Detected: ${tokenTarget} with ${target} Similar to ${token}`)
                        potCount += 1;
                     }
                     if(lastbuys[count-2] == addressPair && lastbuys[count-2] == five.one_x_fiveLP){
                        telegram.bot.sendMessage(`duplicated pair`);
                     }else{
                   //    await swap.buy(token); 
                        //await addons.add(addressPair);
                        five.one_x_fiveLP = potentialTokens;
                        count = count + 1;
                        lastbuys.push(five.one_x_fiveLP);
                        buyNumber = buyNumber + 1;
                        profitHit = true;
                        if(lastbuys[count-1] == lastbuys[count-2] && count >= 2){
                           count -= 1;
                        }
                       if(five.one_x_fiveLP == addressPair){
                       await telegram.bot.sendMessage(msgId,`Purchased --- Liquidity Pair:: ${five.one_x_fiveLP}`)                          
                       await telegram.bot.sendMessage(msgId,
                        five.fiveMessage(five.one_x_fiveLP,ethers.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                      )
                     
                      console.log(five.fiveMessage(addressPair,ethers.formatEther(amount),balanceOfPair,five.one_x_five,balanceOfPair)
                      )
                     
                      console.log(count);
                     console.log(`last buys :${lastbuys[count-2]}`)
                     trade = false;
                     }
                  }
                     erc20.on("Transfer", async(from,to,amount)=>{
                     if(profitHit === true &&
                        to === five.one_x_fiveLP &&
                         to === addressPair &&
                        to === potentialTokens &&
                        lastbuys[count-2] !== addressPair
                        && soldTokens !== addressPair
                        ){                          
                      const CurrentBalance = await erc20.balanceOf(addressPair);
                      let Prof = Number(CurrentBalance).toFixed(3) / Number(IMMUTABLEBALANCE).toFixed(3);
                      buys = buys + 1;
                      telegram.bot.sendMessage(msgId,
                      five.fiveBoughtMessage(addressPair,ethers.formatEther(amount),balanceOfPair,ethers.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                      )
                      console.log(five.fiveBoughtMessage(addressPair,ethers.formatEther(amount),balanceOfPair,ethers.formatEther(CurrentBalance),Prof,five.one_x_five,balanceOfPair,buys)
                     )
                     if(profitHit === true &&
                        Prof > five.one_x_five 
                         ){
                        if(lastbuys[count-2] !== addressPair || lastbuys[count-2] !== five.one_x_fiveLP){
                        telegram.bot.sendMessage(msgId,
                        five.fiveHitMessage(addressPair,balanceOfPair,five.one_x_five,balanceOfPair))
                        trade = true;
                        profitHit = false;
                        Prof = 0;
                        buys = 0;
                        soldTokens = five.one_x_fiveLP
                        buyNumber = 0;
                        }
                        if(count == 5){
                        lastbuys.shift();
                        }
                                         //       await web3.approve(token);
                     //   await swap.sell(token);
                        telegram.bot.sendMessage(msgId,`SOLD ${token} with Pair ${addressPair}`)
                     }
                  
                 }  
             })
           }         
         }
       }
      })
    }
 })
 
)
}

module.exports = {bscFactory,token}