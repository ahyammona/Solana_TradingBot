const pairAlert = (token0,token1,addressPair,Pool) => { 
     return(
    `
            ~~~~~~~~~~~~~~~~~~
            💰💰 New pair ALERT!!!!
            ~~~~~~~~~~~~~~~~~~

            TokenA: ${token0}
            tokenB: ${token1}
            LP: ${addressPair}
            Pool Balance :: ${Pool} WBNB
            `
     )
}

const minimum = 5;

const potentialBuy = (token0,token1,addressPair,Pool) =>{
    return(
      ` 
          💹💹  
  ~~~~~~~~~~~~~~~~~~
  Potential Buy!!!!
  ~~~~~~~~~~~~~~~~~~

   TokenA: ${token0}
   tokenB: ${token1}
   LP: ${addressPair}
   Pool Balance :: ${Pool} WBNB
   `
    )
}

const buyMade = (from,addressPair,amount,IMMUTABLEBALANCE,CurrentBalance,Profit) => {
 return (
  ` 
       💹💹
   ~~~~~~~~~~~~~~~~~~
     A Buy Made!!!!
   ~~~~~~~~~~~~~~~~~~
     from: ${from}
     LP: ${addressPair}
     Amount: ${amount} WBNB
     Initial LP: ${IMMUTABLEBALANCE} WBNB
     Pool Current Balance ::  ${CurrentBalance} WBNB
     Profit: ${Number(Profit).toFixed(2)}x
     Signal: 💹
    `
 )
}
module.exports = {pairAlert, potentialBuy,buyMade,minimum};