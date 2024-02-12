require('dotenv').config();
const express = require("express");

const bsc = require('./network-main/index-bsc');

const arb = require('./network-main/index-eth');
const lp = require("./oneX/five");
const rug = require("./network-main/antirug");
const app = express();
const port = 5001;
app.use(express.json());
const _token = bsc.token;
const pair = lp.one_x_fiveLP;

bsc.bscFactory();
//arb.arbFactory();
if(_token != null){
rug.getPendingRemoveLiquidityTransactions(pair,_token);
}else{
    console.log(`token is null`);
}


app.listen(port, () => {
 }) 