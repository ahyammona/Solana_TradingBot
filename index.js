const { Connection,  PublicKey } = require("@solana/web3.js");
const { Token, AccountLayout, u64 } = require('@solana/spl-token');
const { TokenListProvider } = require("@solana/spl-token-registry");
const {TokenAccount,SPL_ACCOUNT_LAYOUT,LIQUIDITY_STATE_LAYOUT_V4,} = require("@raydium-io/raydium-sdk");
const BN = require('bn.js');

const TelegramBot = require("node-telegram-bot-api");

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

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
const RAv4 = new PublicKey(Raydium_Authority_PUBLIC_KEY);
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://solana-mainnet.core.chainstack.com/2b9789b958c420270f3e09b3fac2d299`, {   
    wsEndpoint: `wss://solana-mainnet.core.chainstack.com/ws/2b9789b958c420270f3e09b3fac2d299`,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});
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
   
    const tx = await mainConnection.getParsedTransaction(
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
    const [initialLP, vault] = await getPoolInfo(lpAccount);
   
    if(
      initialLP % 1 !== 0
      ){
      trade = true
      main(connection, raydium).catch(console.error);
    }else{
    const displayData = [
        { "Token": "LP", "Account Public Key" : lpAccount.toBase58()},
        { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
        { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    ];
    const startTime = await getTime(lpAccount);
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
      && initialLP <= 10
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
     orderBuys(msUntilTarget);
     getChanges(vaultAddress,pairAddress);
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

    const pair = new PublicKey(lpToken);
    
    const info = await tokenConnection.getAccountInfo(pair);
     
    if (!info) return;
    const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);

   
      if(SOLANA == poolState.quoteMint){
         mainCheck = await solConnection.getTokenAccountBalance(
            poolState.quoteVault
         )
         mainAddress = poolState.quoteVault;
      }else{
        mainCheck = await solConnection.getTokenAccountBalance(
            poolState.baseVault
        )
        mainAddress = poolState.baseVault;
      }
    
      const denominator = new BN(10).pow(poolState.baseDecimal);

    return [mainCheck.value.uiAmount, mainAddress];
}

async function getTime(lpToken){
  const pair = new PublicKey(lpToken);
    
  const info = await tokenConnection.getAccountInfo(pair);
   
  if (!info) return;
  const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(info.data);

  const startTime =  poolState.poolOpenTime
  const startDate = new Date(startTime * 1000);
   return startDate;
}

async function getChanges(address, lp){
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
       bot.sendMessage(msgId,` 
       Liquidity Pair: ${lp} 
       Target hit  ${profit}
       `); 
       hit = true;
       addr = 0;
       profit = 0;
       trade = true
       main(connection, raydium).catch(console.error);
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
async function orderBuys(msUntilTarget ){
//const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');
//const raydiumProgramId = new PublicKey('your_raydium_program_id_here');
//const serumProgramId = new PublicKey('your_serum_program_id_here');
//const marketAddress = new PublicKey('your_market_address_here');
//const wallet = Keypair.generate();

// Define the details of your buy transaction
//const amountIn = 1000000000; // 1 SOL
//const amountOutMin = 100000000; // Minimum amount of token you want to receive
//const tradeType = 0; // 0 for limit order, 1 for market order
//const orderType = 0; // 0 for buy, 1 for sell



// Calculate the number of milliseconds until 9:14:56
// const now = new Date();
// const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 14, 56);
// const timeDiff = targetTime - now;
// const msUntilTarget = timeDiff > 0 ? timeDiff : 86400000 - Math.abs(timeDiff);

// Schedule the buy transaction to be executed 4 seconds before 9:14:56
setTimeout(() => {
  // Connect to the Solana devnet cluster
  // const connection = new Connection('https://api.devnet.solana.com');

  // // Get the Serum market account info
  // const marketAccounts = connection.getParsedAccountInfo(marketAddress);
  // const market = marketAccounts.value.data.parsed.info;

  // // Create the buy transaction
  // const transaction = new Transaction();
  // const instruction = Raydium.createLimitOrderIx(
  //   raydiumProgramId,
  //   serumProgramId,
  //   marketAddress,
  //   wallet.publicKey,
  //   new PublicKey('your_base_token_mint_address_here'),
  //   new PublicKey('your_quote_token_mint_address_here'),
  //   amountIn * 1000000000, // Convert SOL to lamports
  //   amountOutMin * 1000000000, // Convert token amount to lamports
  //   tradeType,
  //   orderType,
  //   [],
  //   market.openOrders,
  //   market.bids,
  //   market.asks,
  //   market.eventQueue,
  //   market.coinVault,
  //   market.pcVault,
  //   market.feeAccount,
  console.log("Buy here");
  //   market.vaultSigner,
  //   []
  // );
  // transaction.add(instruction);

  // // Sign the transaction with your wallet
  // transaction.sign(wallet);

  // // Send the transaction to the Solana devnet cluster
  // connection.sendTransaction(transaction, [wallet])
  //   .then(signature => {
  //     console.log(`Buy transaction sent: ${signature}`);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
  }, msUntilTarget - 4000);
}
 function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
 }
 
main(connection, raydium).catch(console.error);
//getPoolInfo('7ipQJShoKhER2gR8feGJ4HDnGb5xTUbHMCdVRomsCMbX')
