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
  TxVersion
} = require('@raydium-io/raydium-sdk');
const bs58 = require('bs58');
const BN = require('bn.js');

const { Wallet } = require('@project-serum/anchor');
const { Connection,Transaction,Keypair, VersionedTransaction,  PublicKey } = require("@solana/web3.js");
const { TokenSwap,TOKEN_SWAP_PROGRAM_ID, TOKEN_PROGRAM_ID } = require('@solana/spl-token-swap');
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

  async function swapOnlyAmm({ targetPool, inputAmount, slippageTolerance }) {
    // -------- pre-action: get pool info --------
  
    const targetPoolInfo = await formatAmmKeysById(targetPool);
    assert(targetPoolInfo, 'cannot find the target pool');
    const poolKeys = jsonInfo2PoolKeys(targetPoolInfo);
    
    // -------- pre-action: get input token account --------
  
    const inputTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      new PublicKey(targetPoolInfo.baseMint),
      wallet.publicKey
    );
  
    // -------- pre-action: get output token account --------
  
    const outputTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet.payer,
      new PublicKey(targetPoolInfo.quoteMint),
      wallet.publicKey
    );
  
    // -------- pre-action: calculate output amount --------
  
    const inputAmountBN = new BN(1 * 10 ** targetPoolInfo.baseDecimals);
    const poolLiquidity = await getPoolLiquidity(connection, poolKeys);
    const outputAmountBN = await calculateOutputAmount(
      inputAmountBN,
      poolLiquidity,
      targetPoolInfo.baseDecimals,

      targetPoolInfo.quoteDecimals,
      0
    );
  
    // -------- action: build and sign transaction --------
  
    const tx = new Transaction();
    tx.add(
      TokenSwap.swapInstruction(
        wallet.publicKey,
        poolKeys.authority,
        inputTokenAccount.address,
        outputTokenAccount.address,
        poolKeys.baseVault,
        poolKeys.quoteVault,
        poolKeys.feeReceiver,
        poolKeys.lpMint,
        poolKeys.openOrders,
        poolKeys.targetOrders,
        inputAmountBN,
        outputAmountBN,
        []
      )
    );
    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    tx.sign(wallet.payer);
  
    // -------- action: send transaction --------
  
    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature);
  
    // -------- post-action: log result --------
  
    console.log(`Swapped ${inputAmount} ${targetPoolInfo.baseMint} for ${outputAmountBN.div(new BN(10 ** targetPoolInfo.quoteDecimals)).toNumber()} ${targetPoolInfo.quoteMint}`);
  }
  
  async function getPoolLiquidity(connection, poolKeys) {
    const liquidityAccount = await connection.getAccountInfo(poolKeys.liquidity);
    if (!liquidityAccount) {
      throw new Error('Liquidity account not found');
    }
    const liquidity = Liquidity.decode(liquidityAccount.data);
    return new BN(liquidity.base.toString()).add(new BN(liquidity.quote.toString()));
  }
  
  async function calculateOutputAmount(inputAmount, poolLiquidity, inputDecimals, outputDecimals, slippageTolerance) {
    const inputAmountWithFee = inputAmount.mul(new BN(10000).add(new BN(slippageTolerance)));
    const outputAmount = inputAmountWithFee
      .mul(new BN(poolLiquidity.toString()))
      .div(new BN(10 ** inputDecimals).mul(inputAmountWithFee).add(new BN(1)));
    return outputAmount.div(new BN(10 ** outputDecimals));
  }
  
  async function getOrCreateAssociatedTokenAccount(connection, payer, mint, owner) {
    let tokenAccount = await getAssociatedTokenAddress(mint, owner);
    let accountInfo = await connection.getAccountInfo(tokenAccount);
    if (accountInfo === null) {
      const createAccountTx = Token.createAssociatedTokenAccountInstruction(
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        mint,
        tokenAccount,
        owner,
        payer
      );
      await sendAndConfirmTransaction(connection, payer, [createAccountTx]);
    }
    return { address: tokenAccount, owner };
  }
  
  async function sendAndConfirmTransaction(connection, payer, instructions) {
    const tx = new Transaction();
    tx.add(...instructions);
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    tx.sign(payer);
    const signature = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(signature);
  }
  
  async function getAssociatedTokenAddress(mint, owner) {
    return (
      await PublicKey.findProgramAddress(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    )[0];
  }
async function howToUse() {
    const inputToken = 'So11111111111111111111111111111111111111112'; // USDC
    const outputToken = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // RAY
    const targetPool = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'; // USDC-RAY pool

   
    swapOnlyAmm({
      targetPool
    })
 }

module.exports = {howToUse}