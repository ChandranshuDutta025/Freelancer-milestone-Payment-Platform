import * as sdk from '@stellar/stellar-sdk';
import { readFileSync, existsSync } from 'fs';
import crypto from 'crypto';
import { config } from 'dotenv';

config();

const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = sdk.Networks.TESTNET;
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'SBKV5QR6NWN3E7ILJP6R26EOFV2RYQHXFDY2F7VYNXZCZVBYI7GGB5JH';

async function rpc(method, params) {
  const raw = await fetch(RPC_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  });
  const data = await raw.json();
  if (data.error) throw new Error(`RPC error: ${JSON.stringify(data.error)}`);
  return data.result;
}

async function simulateTx(txXdr) {
  return rpc('simulateTransaction', { transaction: txXdr });
}

async function sendTx(txXdr) {
  return rpc('sendTransaction', { transaction: txXdr });
}

async function getTx(hash) {
  return rpc('getTransaction', { hash });
}

async function getAccountSeqNum(pubKey) {
  const hor = await fetch(`https://horizon-testnet.stellar.org/accounts/${pubKey}`);
  const data = await hor.json();
  if (data.status === 404) throw new Error(`Account ${pubKey} not funded on testnet`);
  return data.seq_num;
}

function buildTx(sourcePubKey, seqNum, ops) {
  const source = new sdk.Account(sourcePubKey, seqNum);
  let builder = new sdk.TransactionBuilder(source, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  for (const op of ops) builder = builder.addOperation(op);
  return builder.setTimeout(30).build();
}

async function main() {
  const keypair = sdk.Keypair.fromSecret(PRIVATE_KEY);
  const pubKey = keypair.publicKey();
  console.log('Deployer:', pubKey);

  // Check account
  const seqNum = await getAccountSeqNum(pubKey);
  console.log('Seq num:', seqNum);

  const wasmPath = 'contracts/freelancer-milestone/target/wasm32-unknown-unknown/release/freelancer_milestone.wasm';
  if (!existsSync(wasmPath)) throw new Error(`WASM not found at ${wasmPath}`);
  const wasm = readFileSync(wasmPath);
  const wasmHash = sdk.hash(wasm);
  console.log('WASM hash:', wasmHash.toString('hex'));

  // Check if WASM installed
  const codeKey = sdk.xdr.LedgerKey.contractCode(new sdk.xdr.LedgerKeyContractCode({ hash: wasmHash }));
  let hasWasm = false;
  try {
    const entries = await rpc('getLedgerEntries', { keys: [codeKey.toXDR('base64')] });
    hasWasm = entries.entries && entries.entries.length > 0;
  } catch {}
  console.log('WASM installed:', hasWasm);

  if (!hasWasm) {
    console.log('Installing WASM...');
    const installOp = sdk.Operation.uploadContractWasm({ wasm, source: pubKey });
    let tx = buildTx(pubKey, seqNum, [installOp]);
    let sim = await simulateTx(tx.toXDR());
    if (sim.error) throw new Error(`Install sim error: ${sim.error}`);
    
    tx = sdk.SorobanDataBuilder.prepareTransaction(tx, sim);
    tx.sign(keypair);
    
    const sendResp = await sendTx(tx.toXDR());
    if (sendResp.error) throw new Error(`Send error: ${sendResp.error}`);
    console.log('Install sent, hash:', sendResp.hash);

    let status;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      status = await getTx(sendResp.hash);
      if (status.status !== 'NOT_FOUND') break;
    }
    if (status.status !== 'SUCCESS') throw new Error(`Install failed: ${status.status}`);
    console.log('WASM installed successfully');
  }

  // Get current sequence number
  const seqNum2 = await getAccountSeqNum(pubKey);

  // Deploy contract with deterministic salt
  const saltStr = 'freelancer-milestone-v4';
  const salt = crypto.createHash('sha256').update(saltStr).digest();

  const deployOp = sdk.Operation.createCustomContract({
    wasmHash,
    address: new sdk.Address(pubKey),
    salt,
    source: pubKey,
  });

  // Compute expected contract ID
  const deployer = new sdk.Address(pubKey);
  const fromAddr = new sdk.xdr.ContractIdPreimageFromAddress({
    address: deployer.toScAddress(),
    salt
  });
  const preimage = sdk.xdr.ContractIdPreimage.contractIdPreimageFromAddress(fromAddr);
  const networkId = sdk.hash(Buffer.from(NETWORK_PASSPHRASE));
  const combined = Buffer.concat([networkId, preimage.toXDR()]);
  const expectedContractId = sdk.StrKey.encodeContract(sdk.hash(combined));
  console.log('Expected contract ID:', expectedContractId);

  let tx2 = buildTx(pubKey, seqNum2, [deployOp]);
  console.log('Simulating deploy...');
  let sim2 = await simulateTx(tx2.toXDR());
  if (sim2.error) throw new Error(`Deploy sim error: ${sim2.error}`);
  console.log('Deploy simulation OK');

  tx2 = sdk.SorobanDataBuilder.prepareTransaction(tx2, sim2);
  tx2.sign(keypair);
  const sendResp2 = await sendTx(tx2.toXDR());
  console.log('Deploy sent, hash:', sendResp2.hash);

  let status2;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    status2 = await getTx(sendResp2.hash);
    if (status2.status !== 'NOT_FOUND') break;
  }
  console.log('Deploy status:', status2.status);
  if (status2.status !== 'SUCCESS') throw new Error(`Deploy failed: ${JSON.stringify(status2)}`);

  // Verify contract exists
  const contractAddr = sdk.Address.fromString(expectedContractId);
  const instanceKey = sdk.xdr.LedgerKey.contractData(new sdk.xdr.LedgerKeyContractData({
    contract: contractAddr.toScAddress(),
    key: sdk.xdr.ScVal.scvLedgerKeyContractInstance(),
    durability: sdk.xdr.ContractDataDurability.persistent(),
  }));

  try {
    const result = await rpc('getLedgerEntries', { keys: [instanceKey.toXDR('base64')] });
    if (result.entries && result.entries.length > 0) {
      console.log('\nContract instance CONFIRMED on ledger!');
      console.log('Contract ID:', expectedContractId);
      console.log('\nUpdate .env:');
      console.log(`NEXT_PUBLIC_CONTRACT_ID=${expectedContractId}`);
    } else {
      console.log('\nERROR: Contract instance NOT FOUND on ledger');
    }
  } catch(e) {
    console.log('Error verifying contract:', e.message);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
