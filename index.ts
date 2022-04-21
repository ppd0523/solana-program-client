import * as web3 from '@solana/web3.js';
import * as fs from "fs";
import {Transaction, TransactionInstruction} from "@solana/web3.js";


const raw_prk = fs.readFileSync('./devnet.json', 'utf-8');
const prk = Uint8Array.from(JSON.parse(raw_prk));

const raw_program_prk = fs.readFileSync('./program_keypair.json', 'utf-8');
const program_prk = Uint8Array.from(JSON.parse(raw_program_prk));

const userKeypair = web3.Keypair.fromSecretKey(prk);
const programKeypair = web3.Keypair.fromSecretKey(program_prk);

let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");


(async function main(){
  const programAccountInfo = await connection.getAccountInfo(programKeypair.publicKey);
  if (programAccountInfo === null)
    console.error("Not found program");

  // console.log("program addr:", programKeypair.publicKey.toBase58());

  const opts: web3.TransactionInstructionCtorFields = {
    keys: [
      { pubkey: userKeypair.publicKey, isSigner: true, isWritable: false },
      { pubkey: userKeypair.publicKey, isSigner: true, isWritable: false },
    ],
    programId: programKeypair.publicKey,
    data: Buffer.alloc(4, 0),
  }
  const instruction = new web3.TransactionInstruction(opts);
  const transaction = new web3.Transaction().add(instruction);

  const txHash = await web3.sendAndConfirmTransaction(connection, transaction, [userKeypair]);
  console.log('tx hash:', txHash);

})();
