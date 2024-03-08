const { Connection, PublicKey, Keypair, Transaction, VersionedTransaction, TransactionMessage } = require('@solana/web3.js')
const {
  Liquidity,
  LiquidityPoolKeys,
  jsonInfo2PoolKeys,
  LiquidityPoolJsonInfo,
  LIQUIDITY_STATE_LAYOUT_V4,
  SPL_MINT_LAYOUT,
  MARKET_STATE_LAYOUT_V3,
  TokenAccount,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  Percent,
  SPL_ACCOUNT_LAYOUT,
} = require('@raydium-io/raydium-sdk')
const { Wallet } = require('@project-serum/anchor')
const base58 = require('bs58')
const privateKey = new Uint8Array([
  190, 129, 89, 173, 55, 130, 139, 23, 88, 207, 184, 103, 72, 95, 227, 117, 84, 176, 28, 102, 157, 220, 115, 141, 112, 27, 39, 106, 235, 152, 176, 129, 204, 127, 84, 35, 30, 174, 194, 82, 218, 197, 41, 29, 40, 127, 141, 231, 136, 82, 169, 81, 35, 98, 54, 198, 168, 30, 48, 46, 231, 166, 154, 193
]);
const wallet = new Wallet(Keypair.fromSecretKey(privateKey));
const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); 
//const secretKeyHex = Array(32).fill(0).map((_, i) => secretKey[i].toString(16).padStart(2, '0')).join('');
const connection = new Connection(`https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`, {   
  wsEndpoint: `wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw`,
  httpHeaders: {"x-session-hash": SESSION_HASH},
  commitment: 'confirmed' 
});
 

  async function loadPoolKeys() {
    const liquidityJsonResp = await fetch('https://api.raydium.io/v2/sdk/liquidity/mainnet.json')
    if (!liquidityJsonResp.ok) return []
    const liquidityJson = (await liquidityJsonResp.json()) 
    const allPoolKeysJson = [...(liquidityJson?.official ?? []), ...(liquidityJson?.unOfficial ?? [])]

    this.allPoolKeysJson = allPoolKeysJson
  }

  function findPoolInfoForTokens(mintA, mintB) {
    const poolData = this.allPoolKeysJson.find(
      (i) => (i.baseMint === mintA && i.quoteMint === mintB) || (i.baseMint === mintB && i.quoteMint === mintA)
    )

    if (!poolData) return null

    return jsonInfo2PoolKeys(poolData) 
  }

  async function getOwnerTokenAccounts() {
    const walletTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey,
      programId: i.account.owner,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }))
  }

  async function formatAmmKeysById(id) {
    const _id = new PublicKey(id);
    const account = await connection.getAccountInfo(_id);
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
//const minAmountOut = new BN('100000');
  async function getSwapTransaction(
    toToken,
    // fromToken: string,
    targetPool,
    maxLamports = 100000,
    useVersionedTransaction = true,
    fixedSide = 'in'
  ) {
    const amount = 1000;
    const targetPoolInfo = await formatAmmKeysById(targetPool);
   if(targetPoolInfo == null){ console.log('cannot find the target pool')};
    const poolKeys = await jsonInfo2PoolKeys(targetPoolInfo);
    const directionIn = poolKeys.quoteMint.toString() == toToken
   
    const { minAmountOut, amountIn } = await calcAmountOut(poolKeys, amount, directionIn)
    
    const userTokenAccounts = await getOwnerTokenAccounts()
    const swapTransaction = await Liquidity.makeSwapInstructionSimple({
      connection: connection,
      makeTxVersion: useVersionedTransaction ? 0 : 1,
      poolKeys: {
        ...poolKeys,
      },
      userKeys: {
        tokenAccounts: userTokenAccounts,
        owner: wallet.publicKey,
      },
      amountIn: amountIn,
      amountOut: minAmountOut,
      fixedSide: fixedSide,
      config: {
        bypassAssociatedCheck: false,
      },
      computeBudgetConfig: {
        microLamports: maxLamports,
      },
    })

    const recentBlockhashForSwap = await connection.getLatestBlockhash()
    const instructions = swapTransaction.innerTransactions[0].instructions.filter(Boolean)

    if (useVersionedTransaction) {
      const versionedTransaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: wallet.publicKey,
          recentBlockhash: recentBlockhashForSwap.blockhash,
          instructions: instructions,
        }).compileToV0Message()
      )

      versionedTransaction.sign([wallet.payer])

      return versionedTransaction
    }

    const legacyTransaction = new Transaction({
      blockhash: recentBlockhashForSwap.blockhash,
      lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
      feePayer: wallet.publicKey,
    })

    legacyTransaction.add(...instructions)

    return legacyTransaction
  }

  async function sendLegacyTransaction(tx) {
    const txid = await connection.sendTransaction(tx, [wallet.payer], {
      skipPreflight: true,
      maxRetries: 2,
    })

    return txid
  }

  async function sendVersionedTransaction(tx) {
    const txid = await connection.sendTransaction(tx, {
      skipPreflight: true,
      maxRetries: 2,
    })

    return txid
  }

  async function simulateLegacyTransaction(tx) {
    const txid = await connection.simulateTransaction(tx, [this.wallet.payer])

    return txid
  }

  async function simulateVersionedTransaction(tx) {
    const txid = await connection.simulateTransaction(tx)

    return txid
  }

  function getTokenAccountByOwnerAndMint(mint) {
    return {
      programId: TOKEN_PROGRAM_ID,
      pubkey: PublicKey.default,
      accountInfo: {
        mint: mint,
        amount: 0,
      },
    } 
  }

  async function calcAmountOut(poolKeys, rawAmountIn, swapInDirection) {
    const poolInfo = await Liquidity.fetchInfo({ connection: connection, poolKeys })
    connection.simulateTransaction(poolInfo);
    let currencyInMint = poolKeys.baseMint
    let currencyInDecimals = poolInfo.baseDecimals
    let currencyOutMint = poolKeys.quoteMint
    let currencyOutDecimals = poolInfo.quoteDecimals

    if (!swapInDirection) {
      currencyInMint = poolKeys.quoteMint
      currencyInDecimals = poolInfo.quoteDecimals
      currencyOutMint = poolKeys.baseMint
      currencyOutDecimals = poolInfo.baseDecimals
    }

    const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals)
    const amountIn = new TokenAmount(currencyIn, rawAmountIn, false)
    const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals)
    const slippage = new Percent(5, 100) // 5% slippage
    
    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut,
      slippage,
    })

    return {
      amountIn,
      amountOut,
      minAmountOut,
      currentPrice,
      executionPrice,
      priceImpact,
      fee,
    }
  }

  async function howToUse() {
    const inputToken = 'So11111111111111111111111111111111111111112'; // USDC
    const outputToken = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // RAY
    const targetPool = '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2'; // USDC-RAY pool
    const inputTokenAmount = new TokenAmount(inputToken, 10000);
    const slippage = new Percent(1, 100);
  
  
    getSwapTransaction(
      outputToken,
      targetPool
    )
  }
  

module.exports = {howToUse}