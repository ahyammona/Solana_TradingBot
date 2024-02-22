const { Connection, Token,  PublicKey } = require("@solana/web3.js");
const { TokenListProvider } = require("@solana/spl-token-registry");
const {TokenAccount,SPL_ACCOUNT_LAYOUT,LIQUIDITY_STATE_LAYOUT_V4,} = require("@raydium-io/raydium-sdk");
const BN = require('bn.js');

const TelegramBot = require("node-telegram-bot-api");
const { connect } = require("ngrok");
const e = require("express");
TELEGRAM_BOT_TOKEN = "6534890049:AAEa-J3-GFlu6gY5E7p5gVF538NhWERdqw4"

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling : true});
const msgId = -1002075281954;

let initialBalance;
let trade = true;
let target;
let buys;

const SOLANA = "So11111111111111111111111111111111111111112"
const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const Raydium_Authority_PUBLIC_KEY = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
const RAv4 = new PublicKey(Raydium_Authority_PUBLIC_KEY);
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://solana-mainnet.core.chainstack.com/cdbbb84951b6f7f68ace54fcbe3cec88`, {   
    wsEndpoint: `wss://solana-mainnet.core.chainstack.com/ws/cdbbb84951b6f7f68ace54fcbe3cec88 `,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});
const solConnection = new Connection(`https://api.mainnet-beta.solana.com`,{
  wsEndpoint: `wss://api.mainnet-beta.solana.com`,
  httpHeaders: {"x-session-hash": SESSION_HASH}
})
const transConnection = new Connection(`https://cool-alien-slug.solana-mainnet.quiknode.pro/3f918c9a24e56e0ea64d765e4cc98305bc218991`)
const tokenConnection = new Connection(`https://mainnet.helius-rpc.com/?api-key=2313f341-97ba-4d78-88b2-63b3fe80154c
`);

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
                fetchRaydiumAccounts(signature, connection);    
            }
          }
        },
        "finalized"
    );
      
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
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
    const holder = await getTokenHolderCount(tokenAAccount);
    pairAddress = lpAccount; 
    const displayData = [
        { "Token": "LP", "Account Public Key" : lpAccount.toBase58()},
        { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
        { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
    ];
    const [initialLP, vault] = await getPoolInfo(lpAccount);
    const buys = await getBuys(vault,lpAccount)

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
      Token Holders: ${holder} 
    `)

    if(buys >= 1 && initialLP % 1 === 0 && initialLP >= 1){
     target = 1.05;
     trade = false;
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
       Token Holders: ${holder}
       Target : ${target} 
     `)

     getChanges(vault,lpAccount);
    }else if(initialLP >= 1 && holder <= 30){
        target = 1.05;
        trade = false;
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
          Token Holders: ${holder}
          Target : ${target} 
        `)
   
        getChanges(vault,lpAccount);
    }else{
        target = 1.05;
        trade = false;
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
          Token Holders: ${holder}
          Target : ${target} 
        `)
   
        getChanges(vault,lpAccount);
    }
    
}

//tools for fetching information for the main contract



async function getPoolInfo(lpToken){
    let mainCheck;
    let mainAddress;

    const pair = new PublicKey(lpToken);
    const info = await solConnection.getAccountInfo(pair);
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

async function getBuys(address, lp) {
const addr = new PublicKey(address);
let buys = 0
const subscriptionID = solConnection.onAccountChange(
    addr,
    async(updatedAccountInfo, context) => {
     buys = buys + 1;
    }
  )
  return buys;
 }

async function getChanges(address, lp){
const addr = new PublicKey(address);

if (trade == true){
}else{
const subscriptionID = transConnection.onAccountChange(
    addr,
    async(updatedAccountInfo, context) => {
      const solBal = updatedAccountInfo.lamports/1000000000
      const profit = Number(solBal).toFixed(2) / Number(initialBalance).toFixed(2); 
      console.log(`${addr} of ${lp} Updated Sol Bal: ` + Number(solBal).toFixed(2));
      console.log(`Profit ${profit}`);
      if(profit > target){ 
        bot.sendMessage(msgId,"Target hit " + profit)
         addr = 0;
        profit = 0;
        trade = true;
       }else if (profit < 1) {
         addr = 0;
         profit = 0;
         trade = true;
       }
     
    }
  )
 }
}


async function getTokenHolderCount(addr) {
  const mintAddress = new PublicKey(addr);
  // Retrieve the token metadata using the TokenListProvider
  const tokenListProvider = new TokenListProvider();
  const tokenList = await tokenListProvider.resolve();
  const tokenMetadata = tokenList.getList(mintAddress.toBase58());


  if (!tokenMetadata) {
    console.log(`Token metadata not found for mint address ${mintAddress.toBase58()}`);
    return;
  }

  // Retrieve the largest accounts that hold the token
  const tokenAccounts = await tokenConnection.getTokenLargestAccounts(mintAddress)

   const accountSet = new Set();
   for (const account of tokenAccounts.value) {
    accountSet.add(account.address.toBase58());
   }
  const holderCount = accountSet.size;

  return holderCount; 
}

 function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
 }

 if(trade == true){
   main(connection, raydium).catch(console.error);
 }
