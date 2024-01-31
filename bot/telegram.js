const TelegramBot = require("node-telegram-bot-api");
const ethers = require("ethers");
const botWallet = ethers.Wallet.createRandom();

//botWallet.publicKey
//botWallet.privateKey 
const botWalletAddress = '0xF4b39FB6B4bC827fD34a79E8a1e048EF5b21Ba81';
const botPublic = '0x029054c81ddbfa9a49784908873296cf2df0810893153249fd198eb37a25e7ce39';
const mnemonic = 'blind track nest evidence jeans diary about truck candy during bring flock';
const botWalletKey = '0xab17a6d0cbcc7aa7a05f93f07aef9cd80da40a9f6104d82d358951469ecae4ad';

//0xab17a6d0cbcc7aa7a05f93f07aef9cd80da40a9f6104d82d358951469ecae4ad
//Mnemonic {
//    phrase: 'blind track nest evidence jeans diary about truck candy during bring flock',
//  password: '',
  //  wordlist: LangEn { locale: 'en' },
//    entropy: '0xe9783be14fbdfa653326c7282fd35b5f'
//  }
//0xF4b39FB6B4bC827fD34a79E8a1e048EF5b21Ba81
//0x029054c81ddbfa9a49784908873296cf2df0810893153249fd198eb37a25e7ce39
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;



const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling : true});
const msgId = 5793250128;
   
    //         bot.sendMessage(msg.chat.id, "Welcome", {
    //         "reply_markup": {
    //             "keyboard": [
    //                 ["Sample text", 
    //                 "Second sample"
    //              ],  
    //              [
    //                 "Keyboard", "I'm robot"
    //             ]
    //             ]
    //             }
    //         });
            
    //         });
    //         var robot = "I'm robot";   
    //         if (message.text.indexOf(robot) === 0) {
    //            bot.sendMessage(message.chat.id, "Yes I'm robot but not in that way!");
    //          }
   

module.exports = {bot,msgId,botWalletAddress,mnemonic,botWalletKey,botPublic};