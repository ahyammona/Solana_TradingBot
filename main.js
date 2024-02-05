const pairAlert = (token0,token1,addressPair,Pool) => { 
     return(
    `
                 
            💰💰 New pair ALERT!!!!

            
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


module.exports = {pairAlert, potentialBuy,minimum};