import solanaWeb3 from "@solana/web3.js";
const {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = solanaWeb3;

(async () => {
  // Connect to the Solana devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // Create a new Solana account
  const newAccount = Keypair.generate();
  console.log("New account created:", newAccount.publicKey.toBase58());

  // print out the balance of the new account
  const balance = await connection.getBalance(newAccount.publicKey);
  console.log("Balance of new account:", balance / LAMPORTS_PER_SOL);

  // Airdrop some SOL to the new account
  if (balance <= LAMPORTS_PER_SOL) {
    console.log("Low balance, requesting an airdrop...");
    await connection.requestAirdrop(newAccount.publicKey, LAMPORTS_PER_SOL);
  }

  // Recipient account
  const recipientPublicKey = "63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs";

  // Create a transaction
  const transaction = new Transaction();

  // Add transfer instruction
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: newAccount.publicKey,
      toPubkey: new solanaWeb3.PublicKey(recipientPublicKey),
      lamports: 0.1 * LAMPORTS_PER_SOL,
    })
  );

  // Add close account instruction
  transaction.add(
    SystemProgram.closeAccount({
      accountPubkey: newAccount.publicKey,
      destinationPubkey: recipientPublicKey,
      owner: newAccount.publicKey,
    })
  );

  // Sign and send the transaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    newAccount,
  ]);
  console.log("Transaction signature:", signature);
})();
