const ethers = require("ethers");
const swap = require('./swap');
// Set up a provider and contract instance

const provider = new ethers.providers.JsonRpcProvider("https://bsc-testnet.publicnode.com	");
//const provider = new ethers.providers.WebSocketProvider("wss://bsc-testnet.publicnode.com	");
//const provider = new ethers.providers.JsonRpcBatchProvider("https://bsc-testnet.public.blastapi.io");
//const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc_testnet_chapel/47ceb5ecaf80725d3285c7fc84df4f4a0153c6718ea8542f0c702c975b255779");
//mainnet
//const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/")
//const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc")
//const provider = new ethers.providers.WebSocketProvider("wss://solitary-magical-shadow.bsc.quiknode.pro/0c3925605cc3b4ba232f826d940ad6f8f338ba54/")
//const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc/f19c5299523c148fe79a2ef247bda303045c32418d9f6ad946627be6a85a1f67");
//const provider = new ethers.WebSocketProvider("https://bsc-pokt.nodies.app/")
//const provider = new ethers.WebSocketProvider("wss://go.getblock.io/46120e1a3d3847f680e0c4243efcb67c ");const contractAddress = '0x1234567890123456789012345678901234567890';

const contractABI = [
    "event Transfer(address indexed src, address indexed dst, uint val)"
];

const antiRug = async (token,from) => {
    const contract = new ethers.Contract(token, contractABI, provider);

    // Set up a filter to listen for the RemoveLiquidity event
    const filter = await contract.filters.Transfer(from);
    return (
    // Set up a listener to take action when the event is detected
   await contract.on(filter, async (owner, amount0, amount1, to, logIndex, transactionHash, event) => {
      // Check if the transaction is still pending
      await provider.getTransactionReceipt(transactionHash)
      
          if (!receipt && from == token) {
            // The transaction is still pending, so sell the tokens
            //const sellTx = swap.sell(token);
             //sellTx.wait()
            await  console.log("remove liquidity");
            
            await  console.log('Tokens sold successfully.');
                            
          }
        })
  )
} 
module.exports = {antiRug}