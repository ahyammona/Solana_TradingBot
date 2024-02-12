require('dotenv').config();
const express = require("express");
const bsc = require('./network-main/index-bsc');
const swap = require('./network-main/swap');
const arb = require('./network-main/index-eth');
const lp = require("./oneX/five");
const rug = require("./network-main/antirug");
const app = express();
const port = 5001;
app.use(express.json());
const _token = bsc.token;
const pair = lp.one_x_fiveLP;


swap.sell("0x6Ec90334d89dBdc89E08A133271be3d104128Edb");
//bsc.bscFactory();
//arb.arbFactory();
if(_token != null){
rug.getPendingRemoveLiquidityTransactions(pair,_token);
}else{
    console.log(`token is null`);
}


app.listen(port, () => {
 }) 