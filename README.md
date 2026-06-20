![image alt](https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/c68868591155ed4216b342ce289b2dedfce85716/Screenshot%202026-06-21%20015719.png)
# Freelancer Milestone Payment Platform

A decentralized milestone-based payment platform for freelancers built on the **Stellar** blockchain using **Soroban smart contracts**. Clients can create projects with milestones, deposit funds in escrow, and release payments automatically upon milestone approval.

## Features

- **Multi-Wallet Support** - Connect with Freighter, xBull, Albedo, LOBSTR, Rabet, and Hana via StellarWalletsKit
- **Smart Contract Escrow** - Funds are held in a Soroban smart contract until milestones are approved
- **Milestone Management** - Create projects with multiple milestones, each with its own budget
- **Role-Based Actions** - Clients deposit/approve, freelancers accept/submit
- **Real-Time Updates** - Automatic polling and event-based state synchronization
- **Transaction Tracking** - Monitor transaction status (pending/success/failed) with explorer links
- **Activity Feed** - Real-time event stream of all contract interactions
- **Dark Mode** - Full dark/light theme support with next-themes and shadcn/ui
- **Responsive Design** - Mobile-first layout with responsive navigation

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui
- **Blockchain:** Stellar / Soroban
- **Wallet:** StellarWalletsKit
- **SDKs:** `@stellar/stellar-sdk`, `soroban-sdk`
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Icons:** lucide-react
- **Theme:** next-themes
![image alt](https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/c68868591155ed4216b342ce289b2dedfce85716/Screenshot%202026-06-21%20013629.png)

## Setup Instructions

### Prerequisites

- Node.js 20+
- Rust (for smart contract development)
- Stellar CLI (`stellar`)

### 1. Clone and Install

```bash
git clone <repository-url>
cd freelancer-milestone-payment
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Start Development Server

```bash
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Stellar network (testnet/mainnet) | `testnet` |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Network passphrase | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_STELLAR_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed contract ID | (set after deployment) |
| `STELLAR_ACCOUNT` | CLI account name for deployment | `freelancer-admin` |

## Wallet Setup

1. Install one of the supported wallet extensions:
   - [Freighter](https://freighter.app/)
   - [xBull](https://xbull.app/)
   - [Albedo](https://albedo.link/)
   - [LOBSTR](https://lobstr.co/)
   - [Rabet](https://rabet.io/)
   - [Hana](https://hanawallet.io/)

2. Switch to **Testnet** in your wallet settings
3. Fund your account using the [Stellar Lab Friendbot](https://lab.stellar.org/account/create) (testnet only)

## Contract Deployment

### Prerequisites

Install the Stellar CLI:

```bash
cargo install stellar-cli
```

### Deploy to Testnet

```bash
# Ensure your .env is configured
STELLAR_ACCOUNT=freelancer-admin npm run deploy
```

Or manually:

```bash
# Build the contract
cd contracts/freelancer-milestone
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/freelancer_milestone.wasm \
  --ignore-checks \
  --alias freelancer-milestone \
  --source <YOUR-KEY> \
  --network testnet

# Save the returned CONTRACT_ID to .env as NEXT_PUBLIC_CONTRACT_ID
```

### Contract Functions

| Function | Description | Auth |
|----------|-------------|------|
| `create_project` | Create a new project with milestones | Client |
| `accept_project` | Freelancer accepts a project | Freelancer |
| `deposit_milestone` | Client deposits XLM for a milestone | Client |
| `submit_milestone` | Freelancer submits milestone work | Freelancer |
| `approve_milestone` | Client approves milestone | Client |
| `release_payment` | Release payment to freelancer | Anyone |
| `cancel_project` | Client cancels an open project | Client |
| `get_project` | Read project details | - |
| `get_milestone` | Read milestone details | - |
| `get_client_projects` | Get all project IDs for a client | - |
| `get_freelancer_projects` | Get all project IDs for a freelancer | - |

## Running Locally

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables from `.env.example`
4. Set `NEXT_PUBLIC_CONTRACT_ID` to your deployed contract ID
5. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Contract Address

```
CONTRACT_ADDRESS_HERE
```

## Example Transaction Hash

```
TRANSACTION_HASH_HERE
```

## Commit Plan

### Commit 1: Project Initialization and Wallet Integration
- Next.js 15 setup with TypeScript and Tailwind
- StellarWalletsKit integration with multi-wallet support
- Zustand stores for wallet, transactions, events, and projects
- Wallet dashboard, connect/disconnect UI

### Commit 2: Smart Contract Deployment and Frontend Integration
- Soroban smart contract (create/accept/submit/approve/release)
- Contract deployment scripts
- React Query hooks for contract interactions
- Create project modal, milestone tracker, project cards

### Commit 3: Real-Time Events and Transaction Tracking
- Event polling system via Soroban RPC
- Activity feed with event filtering
- Transaction history with status tracking
- Explorer links and automatic updates

### Commit 4: UI Polish and Documentation
- Dark mode with next-themes
- Responsive layout and mobile navigation
- Toast notifications with sonner
- Skeleton loaders and empty states
- Complete README with setup instructions

## License

MIT
