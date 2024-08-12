import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { connection, payer } from "./lib/vars";

(async () => {
  console.log("Payer address:", payer.publicKey.toBase58());

  // get the current balance of the `payer` account on chain
  const currentBalance = await connection.getBalance(payer.publicKey);
  console.log("Current balance of 'payer' (in lamports):", currentBalance);
  console.log(
    "Current balance of 'payer' (in SOL):",
    currentBalance / LAMPORTS_PER_SOL
  );
})();
