import { execSync } from "child_process"
import * as path from "path"
import * as fs from "fs"

// Configuration
const NETWORK = process.env.STELLAR_NETWORK || "testnet"
const RPC_URL =
  process.env.STELLAR_RPC_URL || "https://soroban-testnet.stellar.org"
const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015"
const ACCOUNT = process.env.STELLAR_ACCOUNT || "freelancer-admin"
const CONTRACT_PATH = path.resolve(__dirname, "../contracts/freelancer-milestone")

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: "pipe" })
  } catch (error: any) {
    console.error(`Command failed: ${command}`)
    console.error(error.stderr || error.message)
    throw error
  }
}

async function main() {
  console.log("🚀 Freelancer Milestone Contract Deployer")
  console.log("==========================================")
  console.log(`Network: ${NETWORK}`)
  console.log(`RPC URL: ${RPC_URL}`)
  console.log(`Account: ${ACCOUNT}`)
  console.log("")

  // Step 1: Generate or fund the account
  console.log("📋 Step 1: Setting up account...")
  try {
    const output = runCommand(
      `stellar keys generate --fund ${ACCOUNT} 2>&1 | true`
    )
    console.log("   Account ready")
  } catch {
    console.log("   Account may already exist, continuing...")
  }

  // Step 2: Build the contract
  console.log("🔧 Step 2: Building contract...")
  runCommand(`cd "${CONTRACT_PATH}" && stellar contract build`)
  console.log("   Build complete")

  // Step 3: Find the WASM file
  const wasmPattern = path.join(
    CONTRACT_PATH,
    "target/wasm32v1-none/release/*.wasm"
  )
  const wasmFiles = runCommand(`dir "${wasmPattern}" /b 2>nul || echo ""`).trim()

  if (!wasmFiles) {
    throw new Error("No WASM file found after build")
  }

  const wasmPath = path.join(
    CONTRACT_PATH,
    "target/wasm32v1-none/release",
    wasmFiles.split("\n")[0].trim()
  )

  console.log(`   Found: ${wasmFiles.split("\n")[0].trim()}`)

  // Step 4: Deploy the contract
  console.log("📦 Step 3: Deploying contract...")
  const deployCmd = `stellar contract deploy \
    --wasm "${wasmPath}" \
    --ignore-checks \
    --alias freelancer-milestone \
    --source ${ACCOUNT} \
    --network ${NETWORK} \
    --rpc-url "${RPC_URL}" \
    --network-passphrase "${NETWORK_PASSPHRASE}"`

  const deployOutput = runCommand(deployCmd)
  const contractId = deployOutput.trim()
  console.log(`   Contract ID: ${contractId}`)

  // Step 5: Write contract ID to .env
  console.log("💾 Step 4: Saving contract ID...")
  const envPath = path.resolve(__dirname, "../.env")
  const envExamplePath = path.resolve(__dirname, "../.env.example")

  // Read existing .env or create from example
  let envContent = ""
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8")
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, "utf8")
  }

  // Update or add NEXT_PUBLIC_CONTRACT_ID
  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ID=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ID=.*/,
      `NEXT_PUBLIC_CONTRACT_ID=${contractId}`
    )
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ID=${contractId}\n`
  }

  fs.writeFileSync(envPath, envContent)
  console.log("   Contract ID saved to .env")

  // Step 6: Generate TypeScript bindings
  console.log("🔗 Step 5: Generating bindings...")
  try {
    runCommand(
      `stellar contract bindings typescript \
        --contract-id ${contractId} \
        --output-dir "${path.resolve(__dirname, "../contracts/bindings")}" \
        --overwrite`
    )
    console.log("   Bindings generated")
  } catch {
    console.log("   Warning: Binding generation skipped")
  }

  console.log("")
  console.log("✅ Deployment complete!")
  console.log(`   Contract ID: ${contractId}`)
  console.log(`   Explorer: https://stellar.expert/explorer/testnet/contract/${contractId}`)
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error.message)
  process.exit(1)
})
