import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import * as bs58 from "bs58";
import { payer, connection, STATIC_PUBLICKEY } from "./lib/vars";
import { explorerURL, printConsoleSeparator } from "./lib/helpers";
(async () => {
  // TODO: Create a new Solana account with a balance of some SOL.
  // TODO: Transfer 0.1 SOL from the newly created account to 63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs account.
  // TODO: Close the newly created account.

  // Create a keypair for the new account
  const newAccount = Keypair.generate();
  console.log(`New account public key: ${newAccount.publicKey.toBase58()}`);
  console.log(
    `New account secret key: ${bs58.default.encode(newAccount.secretKey)}`
  );

  // Load payer account from local keystore
  const payerAccount = payer.publicKey;
  console.log(`Payer account: ${payerAccount.toBase58()}`);
  console.log(
    `Payer balance: ${
      (await connection.getBalance(payerAccount)) / LAMPORTS_PER_SOL
    } SOL`
  );

  // Send a minimum SOl to the new account and transfer 0.1 SOL to STATIC_PUBLICKEY

  // on-chain space to allocated (in number of bytes)
  const space = 0;

  // request the cost (in lamports) to allocate `space` number of bytes on chain
  const lamports =
    (await connection.getMinimumBalanceForRentExemption(space)) +
    0.1 * LAMPORTS_PER_SOL;

  console.log("Total lamports:", lamports);

  // create this simple instruction using web3.js helper function
  const createAccountIx = SystemProgram.createAccount({
    // `fromPubkey` - this account will need to sign the transaction
    fromPubkey: payer.publicKey,
    // `newAccountPubkey` - the account address to create on chain
    newAccountPubkey: newAccount.publicKey,
    // lamports to store in this account
    lamports,
    // total space to allocate
    space,
    // the owning program for this account
    programId: SystemProgram.programId,
  });

  // create a transfer instruction to send 0.1 SOL from the new account to the STATIC_RECIPIENT
  const transferIx = SystemProgram.transfer({
    fromPubkey: newAccount.publicKey,
    toPubkey: STATIC_PUBLICKEY,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  // Close the new account by transferring all the lamports to the payer account
  const closeAccountIx = SystemProgram.transfer({
    fromPubkey: newAccount.publicKey,
    toPubkey: payer.publicKey,
    lamports: lamports - 0.1 * LAMPORTS_PER_SOL,
  });

  // get the latest recent blockhash
  const recentBlockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  // create a message (v0)
  const message = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash,
    instructions: [createAccountIx, transferIx, closeAccountIx],
  }).compileToV0Message();
  // create a versioned transaction using the message
  const tx = new VersionedTransaction(message);

  // sign the transaction with our needed Signers (e.g. `payer` and `newAccount`)
  tx.sign([payer, newAccount]);

  console.log("tx after signing:", tx);

  // actually send the transaction
  const signature = await connection.sendTransaction(tx);

  /**
   * display some helper text
   */
  printConsoleSeparator();

  console.log("Transaction completed.");
  console.log(explorerURL({ txSignature: signature }));
})();
