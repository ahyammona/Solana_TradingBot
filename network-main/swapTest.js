const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");

// Replace this with the address of the liquidity pool token you want to listen to
const LP_TOKEN_ADDRESS = new PublicKey("your_lp_token_address_here");

// Create a connection to the Solana cluster
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Set up a transaction listener
connection.onLogs(async (logs, context) => {
  // Filter logs for transactions involving the LP token
  const lpTransactions = logs.filter(
    (log) =>
      log.transaction.message.accountKeys.includes(LP_TOKEN_ADDRESS) &&
      log.transaction.message.instructions.some(
        (instruction) =>
          instruction.programIdKey === PublicKey.findProgramAddressSync(
            [Buffer.from("spl_token_transfer"), LP_TOKEN_ADDRESS.toBuffer()],
            new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
          )[0]
      )
  );

  // Process LP transactions
  for (const log of lpTransactions) {
    console.log("LP transaction detected:", log.transaction);

    // Extract transaction details
    const transaction = log.transaction;
    const fromAddress = transaction.message.accountKeys[0];
    const toAddress = transaction.message.accountKeys[1];
    const amount = transaction.message.instructions[0].parsed.info.amount;

    console.log(`Transferred ${amount.toNumber()} LP tokens from ${fromAddress.toBase58()} to ${toAddress.toBase58()}`);
  }
});