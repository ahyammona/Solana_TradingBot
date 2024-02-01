require('dotenv').config();
const express = require("express");
const ethers = require("ethers");
const telegram = require("./bot/telegram")
const bsc = require('./network-main/index-bsc');
const arb = require('./network-main/index-eth');
const swap = require('./network-main/swap');
const app = express();
const port = 5001;
const rug = require("./network-main/antirug");

app.use(express.json());


telegram.bot.on("message",async (msg)=>{
    console.log(msg);
    await telegram.bot.sendMessage(telegram.msgId,"hi");
})

bsc.bscFactory();
//arb.arbFactory();

app.listen(port, () => {
 }) 