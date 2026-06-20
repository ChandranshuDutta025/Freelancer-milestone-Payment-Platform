import {
  rpc,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  Networks,
} from "@stellar/stellar-sdk"
import * as dotenv from "dotenv"

dotenv.config({ path: "../.env" })

const RPC_URL = process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org"
const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015"
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || ""
const ACCOUNT = process.env.STELLAR_ACCOUNT || ""

async function main() {
  console.log("🔍 Freelancer Milestone Contract Interaction")
  console.log("=============================================")
  console.log(`Contract ID: ${CONTRACT_ID}`)
  console.log(`RPC URL: ${RPC_URL}`)
  console.log(`Network: ${NETWORK_PASSPHRASE}`)
  console.log("")

  if (!CONTRACT_ID) {
    console.error("❌ NEXT_PUBLIC_CONTRACT_ID not set in .env")
    process.exit(1)
  }

  const server = new rpc.Server(RPC_URL)
  const contract = new Contract(CONTRACT_ID)

  const network = NETWORK_PASSPHRASE === "Test SDF Network ; September 2015"
    ? Networks.TESTNET
    : Networks.PUBLIC

  try {
    // Read contract balance
    console.log("📊 Reading contract state...")
    const source = await server.getAccount(CONTRACT_ID)

    const countTx = new TransactionBuilder(source, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_project_count"))
      .setTimeout(30)
      .build()

    const countResult = await server.simulateTransaction(countTx)
    if (rpc.Api.isSimulationSuccess(countResult) && countResult.result) {
      const count = scValToNative(countResult.result.retval)
      console.log(`   Total Projects: ${count}`)
    }

    console.log("")
    console.log("📋 To interact with the contract:")
    console.log("   1. Set STELLAR_ACCOUNT in .env")
    console.log("   2. Use the Stellar CLI:")
    console.log(`      stellar contract invoke \\`)
    console.log(`        --id ${CONTRACT_ID} \\`)
    console.log(`        --source <YOUR-KEY> \\`)
    console.log(`        --network testnet \\`)
    console.log(`        -- \\`)
    console.log(`        get_project_count`)
    console.log("")
    console.log("   Or via the web app:")
    console.log("   - Visit /dashboard to view contract info")
    console.log("   - Visit /app-page to create projects and interact")

  } catch (error: any) {
    console.error("❌ Error:", error.message)
  }
}

main()
