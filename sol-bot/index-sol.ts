
import { Connection,Keypair, VersionedTransaction,  PublicKey } from "@solana/web3.js";
//const fetch = require("cross-fetch");
import fetch from "node-fetch";
import {Buy,Sell}  from './swapAmm';
import { Wallet } from '@project-serum/anchor';
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');

import bs58 from 'bs58';
//const { RaydiumSwap } = require("./swap");
import  TokenSwap  from "@solana/spl-token-swap";
//const test = require("./src/decode_instruction");
 import { LIQUIDITY_STATE_LAYOUT_V4, Liquidity} from "@raydium-io/raydium-sdk";
import {BN} from 'bn.js';

import express, { Express, Request, Response , Application } from 'express';
import { addListener } from "process";

const app = express();
const PORT = 5001;
app.use(express.json())

app.listen(
  PORT, 
  () => console.log(`https://probably-suited-possum.ngrok-free.app/api/callback`)
);



const TelegramBot = require("node-telegram-bot-api");
const { createJupiterApiClient } = require('@jup-ag/api');



const e = require("express");

const TELEGRAM_BOT_TOKEN = "6534890049:AAEa-J3-GFlu6gY5E7p5gVF538NhWERdqw4"

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling : true});
const msgId = -1002075281954;

let picked = false;
let initialBalance: any;
let trade : Boolean = true;
let target;
let Addr;
let pairAddress;
let hit = false;
let bought = false;

const SOLANA = "So11111111111111111111111111111111111111112"
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const Raydium_Authority_PUBLIC_KEY = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
const RAY_SOL_LP_V4_POOL_KEY = '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip';
const RAYDIUM_LIQUIDITY_JSON = 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json';
const privateKey = new Uint8Array([
  228,110,17,108,138,39,103,38,106,160,16,109,222,208,45,94,230,140,168,148,7,166,98,119,236,96,146,0,195,58,217,250,24,236,168,240,15,121,103,31,131,5,134,250,32,85,157,61,17,183,118,63,13,234,77,232,151,30,62,120,119,73,185,174
]);
const wallet = new Wallet(Keypair.fromSecretKey(privateKey));
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session


const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
const RAv4 = new PublicKey(Raydium_Authority_PUBLIC_KEY);
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://solana-mainnet.core.chainstack.com/500a50e949070da73951d8d4f493532b`, {   
    wsEndpoint: `wss://solana-mainnet.core.chainstack.com/ws/500a50e949070da73951d8d4f493532b`,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});
//`https://solana-mainnet.core.chainstack.com/968251fbfe51d98ea3cee0bf693ba515`
//wss://solana-mainnet.core.chainstack.com/ws/968251fbfe51d98ea3cee0bf693ba515`
const mainConnection = new Connection(`https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`, {   
  wsEndpoint: `wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`,
  httpHeaders: {"x-session-hash": SESSION_HASH}
});
//https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw
//wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw
//ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw
const solConnection = new Connection(`https://api.mainnet-beta.solana.com`,{
  wsEndpoint: `wss://api.mainnet-beta.solana.com`,
  httpHeaders: {"x-session-hash": SESSION_HASH}
})
const transConnection = new Connection(`https://cool-alien-slug.solana-mainnet.quiknode.pro/3f918c9a24e56e0ea64d765e4cc98305bc218991`)
const tokenConnection = new Connection(`https://mainnet.helius-rpc.com/?api-key=2313f341-97ba-4d78-88b2-63b3fe80154c
`);
const buysConnection = new Connection(`https://rpc.ankr.com/solana`)

//https://rpc.ankr.com/solana
//https://solana-mainnet.core.chainstack.com
//wss://solana-mainnet.core.chainstack.com/ws
//https://cool-alien-slug.solana-mainnet.quiknode.pro/3f918c9a24e56e0ea64d765e4cc98305bc218991`, {
  //wss://cool-alien-slug.solana-mainnet.quiknode.pro/3f918c9a24e56e0ea64d765e4cc98305bc218991
//wss://solana-mainnet.core.chainstack.com/ws/3b95e037a5072747e238f2688e4e50df
//https://solana-mainnet.core.chainstack.com/3b95e037a5072747e238f2688e4e50df
//https://mainnet.helius-rpc.com/?api-key=2313f341-97ba-4d78-88b2-63b3fe80154c
// Monitor logs

const main = () => app.post("/api/callback", (req, res) => {
  const data = req.body
  const signature = data.signatures[0];  
  if(trade == false && Addr === null){
    console.log("Picked a project");
  }else{
      console.log("Listening to New Pair on Solana");
      console.log("Signature for 'initialize2':", signature);
       fetchRaydiumAccounts(signature);  
    }
});
// Parse transaction and filter data
async function fetchRaydiumAccounts(txId) {
    trade = false;
    const tx : any = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });
     

    const accounts : any = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;
    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }
    const initLp = tx?.meta.postBalances[6] / 1000000000;
    const lp = 4;
    const tokenAIndex = 8;
    const tokenBIndex = 9;
    const lpAccount = accounts[lp];
    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];
   // const holder = await getTokenHolderCount(tokenAAccount);
   
     const [initialLP, vault,startTime, decimal] = await getPoolInfo(lpAccount) || [];
     const margin = initialLP / initLp;
    if(
      margin > 1.5
      ){
      console.log("Over 1.5 margin")
      trade = true;
      }else if(initLp && initialLP > 10 && initLp && initialLP < 1){
      console.log("Init is Not target")
       trade = true 
     }else{
      trade = false
      console.log("Perfect for trade");
     
    const displayData = [
        { "Token": "LP", "Account Public Key" : lpAccount.toBase58()},
        { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
        { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    ];
    const now : any = new Date();
  //  const targetTime : any = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds(),startTime.getMilliseconds());
   // const timeDiff : any = targetTime - now;
    //const msUntilTarget = timeDiff > 0 ? timeDiff : 86400000 - Math.abs(timeDiff);
  
    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
   
    console.log("Sol bal: " + initialLP);
    console.log("Initial Lp: " + initLp);
    console.log("Sol Vault: " + vault);
    console.log("margin : " + Number(margin).toFixed(4));
    console.log("Start time : " + startTime)


   // bot.sendMessage(msgId,`
 //   💹💹  
 //  ~~~~~~~~~~~~~~~~~~
 //  Potential Buy!!!!
 //  ~~~~~~~~~~~~~~~~~~
  //   Link: ${generateExplorerUrl(txId)}   
   //  Token : ${tokenAAccount}
    //  SOl:     ${tokenBAccount}
    //  LP:      ${lpAccount}
     // Sol Bal:   ${initialLP}
    //  startTime: ${startTime}
    //`)
    
    if(margin < 1.2
      &&  initLp >= 2 
      && initLp <= 10000
      && initialLP >=2
      && initialLP <= 10000
     ){
      trade = false;
      pairAddress = lpAccount;
      Addr = vault; 
     target = 1.5;
     hit = false;
     initialBalance = initialLP;
   //  bot.sendMessage(msgId,`
  //   💹💹  
   // ~~~~~~~~~~~~~~~~~~
   // Token Buy Info!!!!
   // ~~~~~~~~~~~~~~~~~~
    //  Link: ${generateExplorerUrl(txId)}   
      
     // Token : ${tokenAAccount}
      // SOl:     ${tokenBAccount}
 //      LP:      ${lpAccount}
  //     Sol Bal:   ${initialLP}
    //   Target : ${target}
   //    startTime: ${startTime}
     //  Whole
 //    `)
     //orderBuys(msUntilTarget,tokenAAccount.toBase58(),lpAccount.toBase58(),Number(decimal));
     
     getChanges(Addr,tokenAAccount,lpAccount,decimal);
     bot.onText(/\/bot (.+)/, async(msg, match) => {                        
      if(match[1] == 'sell'){
         try{
          await orderSell(tokenAAccount.toBase58(),lpAccount.toBase58(),Number(decimal)) 
         }catch (err){
          console.log(err)
         }
        }
      })
    }
   }
 }

//tools for fetching information for the main contract



async function getPoolInfo(lpToken){
    let mainCheck;
    let mainAddress;
    let decimal;

    const pair = new PublicKey(lpToken);
    
    const info = await connection.getAccountInfo(pair);
     
    if (!info) return;
    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);
  
     const startTime =  poolState.poolOpenTime
     const startDate = new Date(startTime * 1000); 
     const Sol : String = SOLANA
     const qouteMint : String = poolState.quoteMint.toString(); 
   
      if(qouteMint == Sol){
         mainCheck = await connection.getTokenAccountBalance(
            poolState.quoteVault
         )
         mainAddress = poolState.quoteVault;
         decimal = poolState.quoteDecimal
      }else{
        mainCheck = await connection.getTokenAccountBalance(
            poolState.baseVault
        )
        mainAddress = poolState.baseVault;
        decimal = poolState.baseDecimal;
      }
    
      const denominator = new BN(10).pow(poolState.baseDecimal);

    return [mainCheck.value.uiAmount, mainAddress,startDate, decimal];
}
async function getChanges(address,token, lp, decimal){
   
    const subscriptionID = connection.onAccountChange(
    Addr,
    async(updatedAccountInfo, context) => {
      if(Addr !== address && lp !== pairAddress){
        console.log("Not == to Address or Pair")
      }else{
      const Bal= updatedAccountInfo.lamports/1000000000
      let prof = Number(Bal) / Number(initialBalance); 
      console.log(`${Addr} of ${lp} Updated Sol Bal: ` + Number(Bal).toFixed(5));
      console.log(`Profit ${Number(prof).toFixed(3)}`);
      // bot.sendMessage(msgId,` 
      // Liquidity Pair: ${lp} 
      //  Profit hit :  ${Number(prof).toFixed(2)}
      // `); 
      }
      if(hit == true){
      }else{
      const solBal:any = updatedAccountInfo.lamports/1000000000
      let profit : any = Number(solBal) / Number(initialBalance); 
     if(profit > target && hit == false){
       //await orderSell(token.toBase58(),lp.toBase58(),Number(decimal)) 
      //  bot.sendMessage(msgId,` 
      //  Liquidity Pair: ${lp} 
      //  Target hit  ${Number(profit).toFixed(2)}
      //  `); 
       hit = true; 
       main();       
       trade = true
       bought = false;
     } else if (hit == false && profit < 0.8) { 
      //   bot.sendMessage(msgId,`Liquidity Pair: ${lp} 
      //  Target Not hit  ${profit} `); 
        trade = true
  //      main(connection, raydium).catch(console.error);
        hit = true;
        main();
      }
     }
    }
  )
}

async function orderBuys(msUntilTarget,token,pool, decimal) {
  bot.sendMessage(msgId,`Purchasing ${token} with ${pool}`);
  const amount = 10000
  setTimeout( async() => {
  await Buy(token,pool,amount,decimal);
  },msUntilTarget - 4000);
}
async function orderSell(token,pool,decimal) {
  const tokenAdd = new PublicKey(token);
  
  const tokenAddress = await getOrCreateAssociatedTokenAccount(mainConnection,wallet, tokenAdd  ,wallet.publicKey )// RAY
 // const getTokenAccountBalance = await tokenConnection.getTokenAccountsByOwner(walletAddress,tokenAddress);
  const balance = Number(tokenAddress.amount);
  //console.log(balance);
  await Sell(token,pool,balance,decimal);

 // main(connection, raydium).catch(console.error);
}

 function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
 }
if(trade == false){

}else{
main();
}
//getPoolInfo('7ipQJShoKhER2gR8feGJ4HDnGb5xTUbHMCdVRomsCMbX')
//swap.howToUse();
//test.decode();
//swap.Sell("8Hr711VC58BPE7nVQJ8yQZhnFnAfuPRLzd9zgsax3h5x","9ZJGCwnv2afLNLFpiKacy1THhod9EWGH44XuipvuhT18",1043,9);
