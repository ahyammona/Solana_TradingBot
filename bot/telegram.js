const TelegramBot = require("node-telegram-bot-api");
const ethers = require("ethers");
const botWallet = ethers.Wallet.createRandom();

//botWallet.publicKey
//botWallet.privateKey 
const botWalletAddress = 'your address';
const botPublic = '';
const mnemonic = '';
const botWalletKey = '';


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;



const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling : true});
//6534890049

module.exports = {bot,msgId,botWalletAddress,mnemonic,botWalletKey,botPublic};