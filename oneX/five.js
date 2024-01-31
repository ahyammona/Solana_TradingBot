const one_x_five = (1.5);
const high_risk = 50 //50 bnb = 14000$;
let otherLp;
var one_x_fiveLP;
const fiveMessage = (addressPair,amount,Pool,one_x_five,balanceOfPair) => {
   return(
    `
    1.5 x
    💹💹
    ~~~~~~~~~~~~~~~~~~
    Token Bought Info!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Amount: ${amount} WBNB
    Pool Balance :: ${Number(Pool).toFixed(2)} WBNB
    Target: ${one_x_five}
    TargetInBNB: ${one_x_five * (balanceOfPair)} WBNB
    Signal: 💹
    `
   )
}
const fiveBoughtMessage = (addressPair,amount,Pool,CurrentBalance,Profit,one_x_five,balanceOfPair,buys) =>{
   return(
    `
        1.5 x
       💹💹
    ~~~~~~~~~~~~~~~~~~
    Token Bought!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Amount: ${Number(amount).toFixed(3)} WBNB
    Initial Balance :: ${Pool} WBNB
    Current Balance :: ${CurrentBalance} WBNB
    Profit: ${Number(Profit).toFixed(3)}x
    Target: ${one_x_five} x
    TargetInBNB: ${one_x_five * balanceOfPair}
    Buys : ${buys}
    Signal: 💹
    `
   )
}

const fiveHitMessage = (addressPair,Pool,one_x_five,balanceOfPair) =>{
    return(
    `
       1.5 x HITTED
         💹💹💹💹
    ~~~~~~~~~~~~~~~~~~
    PROFIT HIT!!!!
    ~~~~~~~~~~~~~~~~~~
    LP: ${addressPair}
    Pool Balance :: ${Number(Pool).toFixed(2)} WBNB
    Target: ${one_x_five}
    TargetInBNB: ${one_x_five * balanceOfPair}
    Signal: 💹
`
    )
}

module.exports = {one_x_five,fiveMessage,fiveBoughtMessage,fiveHitMessage,high_risk,one_x_fiveLP,otherLp}