const { Connection,Keypair, VersionedTransaction,  PublicKey } = require("@solana/web3.js");
//const fetch = require("cross-fetch");
const fetch = require("node-fetch");
const { Jupiter, RouteInfo, TOKEN_LIST_URL, SwapResult } = require('@jup-ag/core');
const JSBI = require('jsbi');
const swap = require("./swapAmm.js");
const { Wallet } = require('@project-serum/anchor');
const { Token, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const bs58 = require('bs58');
//const { RaydiumSwap } = require("./swap");
const { TokenSwap } = require("@solana/spl-token-swap");
//const test = require("./src/decode_instruction");
const { LIQUIDITY_STATE_LAYOUT_V4, Liquidity} = require("@raydium-io/raydium-sdk");
const BN = require('bn.js');


const TelegramBot = require("node-telegram-bot-api");
const { createJupiterApiClient } = require('@jup-ag/api');



const e = require("express");

TELEGRAM_BOT_TOKEN = "6534890049:AAEa-J3-GFlu6gY5E7p5gVF538NhWERdqw4"

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling : true});
const msgId = -1002075281954;

let picked = false;
let initialBalance;
let trade = true;
let target;
let pairAddress;
let hit = false;
let bought = false;

const SOLANA = "So11111111111111111111111111111111111111112"
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const Raydium_Authority_PUBLIC_KEY = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
const RAY_SOL_LP_V4_POOL_KEY = '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip';
const RAYDIUM_LIQUIDITY_JSON = 'https://api.raydium.io/v2/sdk/liquidity/mainnet.json';
const privateKey = new Uint8Array([
  190, 129, 89, 173, 55, 130, 139, 23, 88, 207, 184, 103, 72, 95, 227, 117, 84, 176, 28, 102, 157, 220, 115, 141, 112, 27, 39, 106, 235, 152, 176, 129, 204, 127, 84, 35, 30, 174, 194, 82, 218, 197, 41, 29, 40, 127, 141, 231, 136, 82, 169, 81, 35, 98, 54, 198, 168, 30, 48, 46, 231, 166, 154, 193
]);
const wallet = new Wallet(Keypair.fromSecretKey(privateKey));
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

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

async function main(connection, programAddress) {
    console.log("Raydium Authority v4:", RAv4.toString());
    console.log("Monitoring logs for program:", programAddress.toString());
    
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
          if(trade == false){
          }else{
            if (err) return;
            if (logs && logs.some(log => log.includes("initialize2"))) {
                console.log("Signature for 'initialize2':", signature);
                fetchRaydiumAccounts(signature);  
                trade = false;
            }
          }
        },
        "finalized"
        
    );

      
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId) {
   
    const tx = await transConnection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });
    
    credits += 100;


    

    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;
    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }
    const lp = 4;
    const tokenAIndex = 8;
    const tokenBIndex = 9;
    const lpAccount = accounts[lp];
    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];
   // const holder = await getTokenHolderCount(tokenAAccount);
   
    const displayData = [
        { "Token": "LP", "Account Public Key" : lpAccount.toBase58()},
        { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
        { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    ];
     const [initialLP, vault,startTime, decimal] = await getPoolInfo(lpAccount);
   
    if(
      initialLP % 1 !== 0
      ){
      trade = true
      main(connection, raydium).catch(console.error);
    }else{
    const now = new Date();
    const targetTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds(),startTime.getMilliseconds());
    const timeDiff = targetTime - now;
    const msUntilTarget = timeDiff > 0 ? timeDiff : 86400000 - Math.abs(timeDiff);
    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
   
    console.log("Sol bal: " + initialLP);
    console.log("Sol Vault: " + vault);
    console.log("Total QuickNode Credits Used in this session:", credits);
    
    bot.sendMessage()
    bot.sendMessage(msgId,`
    💹💹  
   ~~~~~~~~~~~~~~~~~~
   Potential Buy!!!!
   ~~~~~~~~~~~~~~~~~~
     Link: ${generateExplorerUrl(txId)}   
     Token : ${tokenAAccount}
      SOl:     ${tokenBAccount}
      LP:      ${lpAccount}
      Sol Bal:   ${initialLP}
      startTime: ${startTime}
    `)
    
    if(initialLP % 1 === 0
      &&  initialLP >= 1 
      && initialLP <= 100
     ){
     const pairAddress = lpAccount;
     const vaultAddress = vault; 
     target = 1.2;
     hit = false;
     initialBalance = initialLP;
     bot.sendMessage(msgId,`
     💹💹  
    ~~~~~~~~~~~~~~~~~~
    Token Buy Info!!!!
    ~~~~~~~~~~~~~~~~~~
      Link: ${generateExplorerUrl(txId)}   
      
      Token : ${tokenAAccount}
       SOl:     ${tokenBAccount}
       LP:      ${lpAccount}
       Sol Bal:   ${initialLP}
       Target : ${target}
       startTime: ${startTime}
       Whole
     `)
     orderBuys(msUntilTarget,tokenAAccount.toBase58(),lpAccount.toBase58(),Number(decimal));
     getChanges(vaultAddress,tokenAAccount,pairAddress,decimal);
    }else{
      trade = true
      main(connection, raydium).catch(console.error);
    }
   }
  
 }

//tools for fetching information for the main contract



async function getPoolInfo(lpToken){
    let mainCheck;
    let mainAddress;
    let decimal;

    const pair = new PublicKey(lpToken);
    
    const info = await tokenConnection.getAccountInfo(pair);
     
    if (!info) return;
    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);

     const startTime =  poolState.poolOpenTime
     const startDate = new Date(startTime * 1000);  
   
      if(SOLANA == poolState.quoteMint){
         mainCheck = await solConnection.getTokenAccountBalance(
            poolState.quoteVault
         )
         mainAddress = poolState.quoteVault;
         decimal = poolState.quoteDecimal
      }else{
        mainCheck = await solConnection.getTokenAccountBalance(
            poolState.baseVault
        )
        mainAddress = poolState.baseVault;
        decimal = poolState.baseDecimal;
      }
    
      const denominator = new BN(10).pow(poolState.baseDecimal);

    return [mainCheck.value.uiAmount, mainAddress,startDate, decimal];
}

// async function getTime(lpToken){
//   const pair = new PublicKey(lpToken);
    
//   const info = await tokenConnection.getAccountInfo(pair);
   
//   if (!info) return;
//   const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);

//   const startTime =  poolState.poolOpenTime
//   const startDate = new Date(startTime * 1000);
//    return startDate;
// }

// const swap = async () => {
//   const INPUT_MINT_ADDRESS = SOLANA
//   const OUTPUT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
//   console.log("Initializing Swap");
//   // A helper function to help us find which output pair is possible
  
  
//   // Create a new Jupiter instance
//   const jupiter = await Jupiter.load({
//     connection,
//     user: wallet, // or public key
//     cluster: 'mainnet-beta',
//     wrapUnwrapSOL: true,
   
//     routeCacheDuration: 60000, // 60 seconds
//   });

//   console.log(`Jupiter instance: ${jupiter}`);
//      // Get routeMap, which maps each tokenMint and their respective tokenMints that are swappable
//   const routeMap = jupiter.getRouteMap();
  
//   // If you know which input/output pair you want
//   const inputToken = tokens.find((t) => t.address == INPUT_MINT_ADDRESS);
//   const outputToken = tokens.find((t) => t.address == OUTPUT_MINT_ADDRESS);
//   // Alternatively, check step 4
//   const routes = await jupiter.computeRoutes({
//     inputMint: new PublicKey(inputToken.address),
//     outputMint: new PublicKey(outputToken.address),
//     amount: JSBI.BigInt(100000), // 1000000 => 1 USDC if inputToken.address is USDC mint.
//     slippageBps  // 1 bps = 0.01%.
//     // forceFetch (optional) => to force fetching routes and not use the cache.
//     // intermediateTokens => if provided will only find routes that use the intermediate tokens.
//     // feeBps => the extra fee in BPS you want to charge on top of this swap.
//     // onlyDirectRoutes =>  Only show single hop routes.
//     // swapMode => "ExactIn" | "ExactOut" Defaults to "ExactIn"  "ExactOut" is to support use cases like payments when you want an exact output amount.
//     // enforceSingleTx =>  Only show routes where only one single transaction is used to perform the Jupiter swap.
//   });

//   const inputAmount = 1; // UI input
//   const inputTokenInfo = tokens.find(item => item.address === SOLANA); // Token info
//   const amount = inputAmount * (10 ** inputTokenInfo.decimals); // Amount to send to Jupiter
//   // Routes are sorted based on outputAmount, so ideally the first route is the best.
//   bestRoute = routes.routesInfos[0]
//   const { execute } = await jupiter.exchange({
//     routeInfo: bestRoute
//   });
//    console.log("Almost Executing swap " + bestRoute);
//   // Execute swap
//   const swapResult = await execute();

//   if (swapResult.error) {
//     console.log(swapResult.error);
//   } else {
//     console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
//     console.log(`inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`);
//     console.log(`inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`);
//   }

//   // ...

// }

async function getChanges(address,token, lp, decimal){
    let addr = new PublicKey(address);
   
    const subscriptionID = transConnection.onAccountChange(
    addr,
    async(updatedAccountInfo, context) => {
      if(hit == true){
      }else{
      const Bal = updatedAccountInfo.lamports/1000000000
      let prof = Number(Bal).toFixed(2) / Number(initialBalance).toFixed(2); 
      console.log(`${addr} of ${lp} Updated Sol Bal: ` + Number(Bal).toFixed(2));
      console.log(`Profit ${prof}`);
      bot.sendMessage(msgId,` 
      Liquidity Pair: ${lp} 
       Profit hit :  ${prof}
      `); 
      }
      if(hit == true){
      }else{
      const solBal = updatedAccountInfo.lamports/1000000000
      let profit = Number(solBal).toFixed(2) / Number(initialBalance).toFixed(2); 
     if(profit > target){
       await orderSell(token.toBase58(),lp.toBase58(),Number(decimal)) 
       bot.sendMessage(msgId,` 
       Liquidity Pair: ${lp} 
       Target hit  ${profit}
       `); 
       hit = true;
       addr = 0;
       profit = 0;
       trade = true
       bought = false;
    } else if (hit == false && profit < 0.8 && profit > 0.0) { 
        bot.sendMessage(msgId,`Liquidity Pair: ${lp} 
       Target Not hit  ${profit} `); 
        trade = true
        main(connection, raydium).catch(console.error);
        hit == true;
        addr = 0;
        profit = 0;
        bought = false;
      }
    }
    }
  )
}

async function orderBuys(msUntilTarget,token,pool, decimal) {
  bot.sendMessage(msgId,`Purchasing ${token} with ${pool}`);
  const amount = 10000
  setTimeout( async() => {
  await swap.Buy(token,pool,amount,decimal);
  },msUntilTarget - 6000);
}
async function orderSell(token) {
  const tokenAdd = new PublicKey(token);
  const tokenAddress = await getOrCreateAssociatedTokenAccount(mainConnection,wallet, tokenAdd  ,wallet.publicKey )// RAY
 // const getTokenAccountBalance = await tokenConnection.getTokenAccountsByOwner(walletAddress,tokenAddress);
  const balance = Number(tokenAddress.amount);
  //console.log(balance);
  await swap.Sell(token,pool,balance,decimal);

 // main(connection, raydium).catch(console.error);
}

 function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
 }
 
main(connection, raydium).catch(console.error);
//getPoolInfo('7ipQJShoKhER2gR8feGJ4HDnGb5xTUbHMCdVRomsCMbX')
//swap.howToUse();
//test.decode();
//orderSell("H5d4Ce7YTLwxEKKAjRaQgPJPQhs2epDXUirpDepmZweR");