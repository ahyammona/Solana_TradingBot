"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var assert = require("assert");
var anchor_1 = require("@project-serum/anchor");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var web3_js_1 = require("@solana/web3.js");
var SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
var makeTxVersion = raydium_sdk_1.TxVersion.V0; // LEGACY
var connection = new web3_js_1.Connection("https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw", {
    wsEndpoint: "wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw",
    httpHeaders: { "x-session-hash": SESSION_HASH },
    commitment: 'confirmed'
});
var mainConnection = new web3_js_1.Connection("https://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw", {
    wsEndpoint: "wss://solana-mainnet.g.alchemy.com/v2/ivbpOnYRAvSjoLJEpPNP910PYIcrtNrw",
    httpHeaders: { "x-session-hash": SESSION_HASH },
    commitment: 'confirmed'
});
var DEFAULT_TOKEN = {
    'SOL': new raydium_sdk_1.Currency(9, 'USDC', 'USDC'),
    'WSOL': new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey('So11111111111111111111111111111111111111112'), 9, 'WSOL', 'WSOL'),
    'USDC': new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), 6, 'USDC', 'USDC'),
    'RAY': new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey('34K23tYU71NbNypSA2TZ9M3xA8kF1pCBU7r5LwhAmEaK'), 6),
    'RAY_USDC-LP': new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey('FGYXP4vBkMEtKhxrmEBcWN8VNmXX8qNgEJpENKDETZ4Y'), 6, 'RAY-USDC', 'RAY-USDC')
};
var privateKey = new Uint8Array([
    190, 129, 89, 173, 55, 130, 139, 23, 88, 207, 184, 103, 72, 95, 227, 117, 84, 176, 28, 102, 157, 220, 115, 141, 112, 27, 39, 106, 235, 152, 176, 129, 204, 127, 84, 35, 30, 174, 194, 82, 218, 197, 41, 29, 40, 127, 141, 231, 136, 82, 169, 81, 35, 98, 54, 198, 168, 30, 48, 46, 231, 166, 154, 193
]);
var wallet = new anchor_1.Wallet(web3_js_1.Keypair.fromSecretKey(privateKey));
var addLookupTableInfo = raydium_sdk_1.LOOKUP_TABLE_CACHE;
function formatAmmKeysById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var account, info, marketId, marketAccount, marketInfo, lpMint, lpMintAccount, lpMintInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(new web3_js_1.PublicKey(id))];
                case 1:
                    account = _a.sent();
                    if (account === null)
                        throw Error(' get id info error ');
                    info = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.decode(account.data);
                    marketId = info.marketId;
                    return [4 /*yield*/, connection.getAccountInfo(marketId)];
                case 2:
                    marketAccount = _a.sent();
                    if (marketAccount === null)
                        throw Error(' get market info error');
                    marketInfo = raydium_sdk_1.MARKET_STATE_LAYOUT_V3.decode(marketAccount.data);
                    lpMint = info.lpMint;
                    return [4 /*yield*/, connection.getAccountInfo(lpMint)];
                case 3:
                    lpMintAccount = _a.sent();
                    if (lpMintAccount === null)
                        throw Error(' get lp mint info error');
                    lpMintInfo = raydium_sdk_1.SPL_MINT_LAYOUT.decode(lpMintAccount.data);
                    return [2 /*return*/, {
                            id: id,
                            baseMint: info.baseMint.toString(),
                            quoteMint: info.quoteMint.toString(),
                            lpMint: info.lpMint.toString(),
                            baseDecimals: info.baseDecimal.toNumber(),
                            quoteDecimals: info.quoteDecimal.toNumber(),
                            lpDecimals: lpMintInfo.decimals,
                            version: 4,
                            programId: account.owner.toString(),
                            authority: raydium_sdk_1.Liquidity.getAssociatedAuthority({ programId: account.owner }).publicKey.toString(),
                            openOrders: info.openOrders.toString(),
                            targetOrders: info.targetOrders.toString(),
                            baseVault: info.baseVault.toString(),
                            quoteVault: info.quoteVault.toString(),
                            withdrawQueue: info.withdrawQueue.toString(),
                            lpVault: info.lpVault.toString(),
                            marketVersion: 3,
                            marketProgramId: info.marketProgramId.toString(),
                            marketId: info.marketId.toString(),
                            marketAuthority: raydium_sdk_1.Market.getAssociatedAuthority({ programId: info.marketProgramId, marketId: info.marketId }).publicKey.toString(),
                            marketBaseVault: marketInfo.baseVault.toString(),
                            marketQuoteVault: marketInfo.quoteVault.toString(),
                            marketBids: marketInfo.bids.toString(),
                            marketAsks: marketInfo.asks.toString(),
                            marketEventQueue: marketInfo.eventQueue.toString(),
                            lookupTableAccount: web3_js_1.PublicKey["default"].toString()
                        }];
            }
        });
    });
}
function sendTx(connection, payer, txs, options) {
    return __awaiter(this, void 0, void 0, function () {
        var txids, _i, txs_1, iTx, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    txids = [];
                    _i = 0, txs_1 = txs;
                    _e.label = 1;
                case 1:
                    if (!(_i < txs_1.length)) return [3 /*break*/, 6];
                    iTx = txs_1[_i];
                    if (!(iTx instanceof web3_js_1.VersionedTransaction)) return [3 /*break*/, 3];
                    iTx.sign([payer]);
                    _b = (_a = txids).push;
                    return [4 /*yield*/, connection.sendTransaction(iTx, options)];
                case 2:
                    _b.apply(_a, [_e.sent()]);
                    return [3 /*break*/, 5];
                case 3:
                    _d = (_c = txids).push;
                    return [4 /*yield*/, connection.sendTransaction(iTx, [payer], options)];
                case 4:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, txids];
            }
        });
    });
}
function getWalletTokenAccount(connection, wallet) {
    return __awaiter(this, void 0, void 0, function () {
        var walletTokenAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getTokenAccountsByOwner(wallet, {
                        programId: raydium_sdk_1.TOKEN_PROGRAM_ID
                    })];
                case 1:
                    walletTokenAccount = _a.sent();
                    return [2 /*return*/, walletTokenAccount.value.map(function (i) { return ({
                            pubkey: i.pubkey,
                            programId: i.account.owner,
                            accountInfo: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.decode(i.account.data)
                        }); })];
            }
        });
    });
}
function buildAndSendTx(innerSimpleV0Transaction, options) {
    return __awaiter(this, void 0, void 0, function () {
        var willSendTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, raydium_sdk_1.buildSimpleTransaction)({
                        connection: connection,
                        makeTxVersion: makeTxVersion,
                        payer: wallet.publicKey,
                        innerTransactions: innerSimpleV0Transaction,
                        addLookupTableInfo: addLookupTableInfo
                    })];
                case 1:
                    willSendTx = _a.sent();
                    return [4 /*yield*/, sendTx(connection, wallet.payer, willSendTx, options)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function swapOnlyAmm(input) {
    return __awaiter(this, void 0, void 0, function () {
        var targetPoolInfo, maxLamports, poolKeys, _a, amountOut, minAmountOut, _b, _c, innerTransactions;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, formatAmmKeysById(input.targetPool)];
                case 1:
                    targetPoolInfo = _f.sent();
                    maxLamports = 10000;
                    assert(targetPoolInfo, 'cannot find the target pool');
                    poolKeys = (0, raydium_sdk_1.jsonInfo2PoolKeys)(targetPoolInfo);
                    _c = (_b = raydium_sdk_1.Liquidity).computeAmountOut;
                    _d = {
                        poolKeys: poolKeys
                    };
                    return [4 /*yield*/, raydium_sdk_1.Liquidity.fetchInfo({ connection: connection, poolKeys: poolKeys })];
                case 2:
                    _a = _c.apply(_b, [(_d.poolInfo = _f.sent(),
                            _d.amountIn = input.inputTokenAmount,
                            _d.currencyOut = input.outputToken,
                            _d.slippage = input.slippage,
                            _d)]), amountOut = _a.amountOut, minAmountOut = _a.minAmountOut;
                    return [4 /*yield*/, raydium_sdk_1.Liquidity.makeSwapInstructionSimple({
                            connection: connection,
                            poolKeys: poolKeys,
                            userKeys: {
                                tokenAccounts: input.walletTokenAccounts,
                                owner: input.wallet.publicKey
                            },
                            amountIn: input.inputTokenAmount,
                            amountOut: minAmountOut,
                            fixedSide: 'in',
                            makeTxVersion: makeTxVersion,
                            computeBudgetConfig: {
                                microLamports: maxLamports
                            }
                        })];
                case 3:
                    innerTransactions = (_f.sent()).innerTransactions;
                    console.log('amountOut:', amountOut.toFixed(), '  minAmountOut: ', minAmountOut.toFixed());
                    _e = {};
                    return [4 /*yield*/, buildAndSendTx(innerTransactions)];
                case 4: return [2 /*return*/, (_e.txids = _f.sent(), _e)];
            }
        });
    });
}
function Buy(token, Pool, amount, decimal) {
    return __awaiter(this, void 0, void 0, function () {
        var inputToken, outputToken, targetPool, inputTokenAmount, slippage, walletTokenAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputToken = DEFAULT_TOKEN.WSOL // USDC
                    ;
                    outputToken = new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(token), decimal) // RAY
                    ;
                    targetPool = Pool // USDC-RAY pool
                    ;
                    inputTokenAmount = new raydium_sdk_1.TokenAmount(inputToken, amount);
                    slippage = new raydium_sdk_1.Percent(1, 100);
                    return [4 /*yield*/, getWalletTokenAccount(connection, wallet.publicKey)];
                case 1:
                    walletTokenAccounts = _a.sent();
                    swapOnlyAmm({
                        outputToken: outputToken,
                        targetPool: targetPool,
                        inputTokenAmount: inputTokenAmount,
                        slippage: slippage,
                        walletTokenAccounts: walletTokenAccounts,
                        wallet: wallet.payer
                    }).then(function (_a) {
                        var txids = _a.txids;
                        /** continue with txids */
                        console.log('txids', txids);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function Sell(token, Pool, amount, decimal) {
    return __awaiter(this, void 0, void 0, function () {
        var inputToken, outputToken, targetPool, inputTokenAmount, slippage, walletTokenAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputToken = new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, new web3_js_1.PublicKey(token), decimal) // USDC
                    ;
                    outputToken = DEFAULT_TOKEN.WSOL // RAY
                    ;
                    targetPool = Pool // USDC-RAY pool
                    ;
                    inputTokenAmount = new raydium_sdk_1.TokenAmount(inputToken, amount);
                    slippage = new raydium_sdk_1.Percent(1, 100);
                    return [4 /*yield*/, getWalletTokenAccount(connection, wallet.publicKey)];
                case 1:
                    walletTokenAccounts = _a.sent();
                    swapOnlyAmm({
                        outputToken: outputToken,
                        targetPool: targetPool,
                        inputTokenAmount: inputTokenAmount,
                        slippage: slippage,
                        walletTokenAccounts: walletTokenAccounts,
                        wallet: wallet.payer
                    }).then(function (_a) {
                        var txids = _a.txids;
                        /** continue with txids */
                        console.log('txids', txids);
                    });
                    return [2 /*return*/];
            }
        });
    });
}

module.exports = {Buy, Sell};