require('dotenv').config();
const express = require("express");
const bsc = require('./network-main/index-bsc');
const arb = require('./network-main/index-eth');
const swap = require('./network-main/swap');
const app = express();
const port = 5001;

app.use(express.json());

//swap.buy('0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867');
swap.sell('0xCb173460EF9C54dA4EA913273D947f40fEB224ED');
//0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867
//0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee
//bsc.bscFactory();
//arb.arbFactory();

app.listen(port, () => {
 }) 