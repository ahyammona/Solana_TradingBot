const assert = require('assert');
const {
  jsonInfo2PoolKeys,
  Liquidity,
  LiquidityPoolKeys,
  MARKET_STATE_LAYOUT_V3,
  SPL_MINT_LAYOUT,
  LIQUIDITY_STATE_LAYOUT_V4,
  SPL_ACCOUNT_LAYOUT,
  buildSimpleTransaction,
  Percent,
  TxVersion,
  TOKEN_PROGRAM_ID,
  TradeV2,
  Token,
  TokenAmount,
  publicKey,
} = require('@raydium-io/raydium-sdk');
const bs58 = require('bs58');
const BN = require('bn.js');

const { Wallet } = require('@project-serum/anchor');
const { Connection,Keypair, VersionedTransaction,  PublicKey } = require("@solana/web3.js");
const { TokenSwap } = require('@solana/spl-token-swap');
const { constants } = require('fs/promises');
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;
const connection = new Connection(`https://solana-mainnet.core.chainstack.com/2b9789b958c420270f3e09b3fac2d299`, {   
    wsEndpoint: `wss://solana-mainnet.core.chainstack.com/ws/2b9789b958c420270f3e09b3fac2d299`,
    httpHeaders: {"x-session-hash": SESSION_HASH},
    commitment: 'confirmed' 
});
const mainConnection = new Connection(`https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`, {   
  wsEndpoint: `wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`,
  httpHeaders: {"x-session-hash": SESSION_HASH},
  commitment: 'confirmed' 
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

const makeTxVersion = TxVersion.V0
const privateKey = new Uint8Array([
    190, 129, 89, 173, 55, 130, 139, 23, 88, 207, 184, 103, 72, 95, 227, 117, 84, 176, 28, 102, 157, 220, 115, 141, 112, 27, 39, 106, 235, 152, 176, 129, 204, 127, 84, 35, 30, 174, 194, 82, 218, 197, 41, 29, 40, 127, 141, 231, 136, 82, 169, 81, 35, 98, 54, 198, 168, 30, 48, 46, 231, 166, 154, 193
  ]);
const wallet = new Wallet(Keypair.fromSecretKey(privateKey));

async function WalletTokenAccount() {
    const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    console.log("passed here");
    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey,
      programId: i.account.owner,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }));

  }
  
async function formatAmmKeysById(id) {
    const account = await connection.getAccountInfo(new PublicKey(id));
    if (!account) throw Error('get id info error');
    const info = LIQUIDITY_STATE_LAYOUT_V4.decode(account.data);
  
    const marketId = info.marketId;
    const marketAccount = await connection.getAccountInfo(marketId);
    if (!marketAccount) throw Error('get market info error');
    const marketInfo = MARKET_STATE_LAYOUT_V3.decode(marketAccount.data);
  
    const lpMint = info.lpMint;
    const lpMintAccount = await connection.getAccountInfo(lpMint);
    if (!lpMintAccount) throw Error('get lp mint info error');
    const lpMintInfo = SPL_MINT_LAYOUT.decode(lpMintAccount.data);
  
    return {
      id,
      baseMint: info.baseMint.toString(),
      quoteMint: info.quoteMint.toString(),
      lpMint: info.lpMint.toString(),
      baseDecimals: info.baseDecimal.toNumber(),
      quoteDecimals: info.quoteDecimal.toNumber(),
      lpDecimals: lpMintInfo.decimals,
      version: 4,
      programId: account.owner.toString(),
      authority: (await PublicKey.createWithSeed(account.owner, 'authority', account.owner)).toString(),
      openOrders: info.openOrders.toString(),
      targetOrders: info.targetOrders.toString(),
      baseVault: info.baseVault.toString(),
      quoteVault: info.quoteVault.toString(),
      withdrawQueue: info.withdrawQueue.toString(),
      lpVault: info.lpVault.toString(),
      marketVersion: 3,
      marketProgramId: info.marketProgramId.toString(),
      marketId: info.marketId.toString(),
      marketAuthority: (await PublicKey.createWithSeed(info.marketProgramId, 'authority', info.marketId)).toString(),
      marketBaseVault: marketInfo.baseVault.toString(),
      marketQuoteVault: marketInfo.quoteVault.toString(),
      marketBids: marketInfo.bids.toString(),
      marketAsks: marketInfo.asks.toString(),
      marketEventQueue: marketInfo.eventQueue.toString(),
      lookupTableAccount: PublicKey.default.toString()
    };
  }
  async function bANDSTx(innerSimpleV0Transaction, options) {
    const willSendTx = await buildSimpleTransaction({
      connection,
      makeTxVersion,
      payer: wallet.publicKey,
      innerTransactions: innerSimpleV0Transaction,
      addLookupTableInfo: addLookupTableInfo,
    })
  
    return await sendTx(connection, wallet, willSendTx, options)
}

async function getInfo(pool) {
  const accountInfo = await connection.getAccountInfo(new PublicKey(pool));

  if(accountInfo == null){
    console.log("nothing found");
  }
  const info = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
  return(
    info.status,
    info.baseDecimal,
    info.quoteDecimal,
    info.lpDecimal,
    info.quoteLotSize,
    info.lpReserve,
    info.poolOpenTime
  )
} 
async function swapOnlyAmm() {
  // -------- pre-action: get pool info --------
  const inputToken = 'So11111111111111111111111111111111111111112'; // USDC
  const outputToken = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // RAY
  const targetPool = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'; // USDC-RAY pool
  const inputTokenAmount = new TokenAmount(inputToken, 10000,false);
  
  const slippage = new Percent(1, 100);
  
   
 
  const targetPoolInfo = await formatAmmKeysById(targetPool);
  assert(targetPoolInfo, 'cannot find the target pool');
  const poolKeys = await jsonInfo2PoolKeys(targetPoolInfo);
  //const minAmountOut = new BN('100000');

  const accountInfo = await connection.getAccountInfo(new PublicKey(targetPool));

  if(accountInfo == null){
    console.log("nothing found");
  }
  const info = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
  
 // const poolInfo =await getInfo(targetPool)
  //info.
 // currencyOutDecimals = info.baseDecimal
   const poolInfo = await Liquidity.fetchInfo({ mainConnection, poolKeys });
  // const currencyOut = new Token(TOKEN_PROGRAM_ID, outputToken, currencyOutDecimals)
  console.log(poolInfo);
  
  //   const { amountOut, minAmountOut } = Liquidity.computeAmountOut({
  //     poolKeys: poolKeys,
  //     poolInfo: info,
  //     amountIn: inputTokenAmount,
  //     currencyOut: currencyOut,
  //     slippage: slippage
  //   });
  //  console.log("amount Out :" + amountOut);
  //  console.log("amount in :" + minAmountOut);
  
//   const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
//     mainConnection,
//     poolKeys,
//     userKeys: {
//       tokenAccounts: walletTokenAccounts,
//       owner: wallet.publicKey,
//     },
//     amountIn: inputTokenAmount,
//     amountOut: minAmountOut,
//     fixedSide: 'in',
//     makeTxVersion,
//   });

//  console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed());
//  console.log(innerTransactions);
//  return { txids: await bANDSTx(innerTransactions) };
}

async function howToUse() {


  swapOnlyAmm()
}

// async function trade() {
//   TokenSwap.swapInstruction(
//     tokenSwapStateAccount,
//     swapAuthority,
//     userPublicKey,
//     userTokenA,
//     poolTokenA,
//     poolTokenB,
//     userTokenB,
//     poolMint,
//     feeAccount,
//     null,
//     TOKEN_SWAP_PROGRAM_ID,
//     TOKEN_PROGRAM_ID,
//     amount * 10 ** MintInfoTokenA.decimals,
//     0
//   )


// }
module.exports = {howToUse};