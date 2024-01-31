const one_x_five = (2);
const high_risk = 50 //50 bnb = 14000$;
let otherLp;
var one_x_fiveLP;
const fiveMessage = (addressPair,amount,Pool,one_x_five,balanceOfPair) => {
   return(
    `
    2x
    💹💹
    ~~~~~~~~~~~~~~~~~~
    Token Bought Info!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Amount: ${amount} WETH
    Pool Balance :: ${Number(Pool).toFixed(2)} WETH
    Target: ${one_x_five}
    TargetInBNB: ${one_x_five * (balanceOfPair)} WETH
    Signal: 💹
    `
   )
}
const fiveBoughtMessage = (addressPair,amount,Pool,CurrentBalance,Profit,one_x_five,balanceOfPair,buys) =>{
   return(
    `
        2 x
       💹💹
    ~~~~~~~~~~~~~~~~~~
    Token Bought!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Amount: ${Number(amount).toFixed(3)} WETH
    Initial Balance :: ${Pool} WETH
    Current Balance :: ${CurrentBalance} WETH
    Profit: ${Number(Profit).toFixed(3)}x
    Target: ${one_x_five} x
    TargetInBNB: ${one_x_five * balanceOfPair} WETH
    Buys : ${buys}
    Signal: 💹
    `
   )
}

const fiveHitMessage = (addressPair,Pool,one_x_five,balanceOfPair) =>{
    return(
    `
       2 x HITTED
         💹💹💹💹
    ~~~~~~~~~~~~~~~~~~
    PROFIT HIT!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Pool Balance :: ${Number(Pool).toFixed(2)} WETH
    Target: ${one_x_five}
    TargetInBNB: ${one_x_five * balanceOfPair} WETH
    Signal: 💹
`
    )
}

module.exports = {one_x_five,fiveMessage,fiveBoughtMessage,fiveHitMessage,high_risk,one_x_fiveLP,otherLp}