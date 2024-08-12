import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import dotenv from "dotenv";
import * as bs58 from "bs58";

function createAccount(): Keypair {
  const keypair = Keypair.generate();
  console.log("Keypair generated:", keypair);
  console.log("Public key:", keypair.publicKey.toBase58());
  // Convert secret key to hex string
  console.log("Private key:", bs58.default.encode(keypair.secretKey));
  return keypair;
}

function mintSol() {}

async function sendSol(sender: string, receiver: string, amount: number) {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(sender),
      toPubkey: new PublicKey(receiver),
      lamports: amount,
    })
  );

  await sendAndConfirmTransaction(connection, transaction, [keypair]);
  // return txid;
}

function displayBalance(account: string): number {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  connection.getBalance(new PublicKey(account)).then((balance) => {
    console.log("Balance:", balance);
    return balance;
  });
  return -1;
}

// ---------------------------------------------------------
// read from dotenv file
dotenv.config();
const sender = process.env.PUBLIC_KEY as string;
const testAccount = "GCuLmMtarn8BahRvp51LMPgK6vPcvbp4fH2mXqGdcfXK";
displayBalance(sender);
displayBalance(testAccount);

const keypair = createAccount();
console.log("Public key:", keypair.publicKey.toBase58());
