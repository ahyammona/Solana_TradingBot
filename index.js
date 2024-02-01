require('dotenv').config();
const express = require("express");
const ethers = require("ethers");
const bsc = require('./network-main/index-bsc');
const arb = require('./network-main/index-eth');
const swap = require('./network-main/swap');
const app = express();
const port = 5001;
const rug = require("./network-main/antirug");

app.use(express.json());




bsc.bscFactory();
//arb.arbFactory();

app.listen(port, () => {
 }) 