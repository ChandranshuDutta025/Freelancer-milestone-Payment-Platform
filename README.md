# Freelancer Milestone Payment Platform

> **Live Demo:** [https://ai-resume-builder-eta-nine.vercel.app](https://ai-resume-builder-eta-nine.vercel.app)

A decentralized milestone-based payment platform for freelancers built on the **Stellar** blockchain using **Soroban smart contracts**. Clients create projects with milestones, deposit funds in escrow, and release payments automatically upon milestone approval.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Animation** | Framer Motion |
| **State** | Zustand |
| **Data Fetching** | TanStack Query |
| **Blockchain** | Stellar / Soroban (soroban-sdk 22.x) |
| **SDKs** | `@stellar/stellar-sdk` v13, StellarWalletsKit |
| **Wallets** | Freighter, xBull, Albedo, LOBSTR, Rabet, Hana |

## Project Structure

```
ai-resume-builder/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (providers, navbar)
│   ├── globals.css               # Tailwind + CSS variables (light/dark)
│   ├── page-transition.tsx       # AnimatePresence page wrapper
│   ├── query-provider.tsx        # TanStack Query provider
│   ├── activity/                 # Activity feed page
│   ├── app-page/                 # Main app / project listing
│   ├── dashboard/                # Dashboard with charts
│   └── transactions/             # Transaction history
│
├── components/
│   ├── activity/ActivityFeed.tsx
│   ├── layout/
│   │   ├── Navbar.tsx            # Fixed, scroll-aware navbar
│   │   └── Footer.tsx
│   ├── projects/
│   │   ├── CreateProjectModal.tsx
│   │   ├── MilestoneTracker.tsx
│   │   └── ProjectCard.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx      # next-themes wrapper
│   │   └── ThemeToggle.tsx       # Animated sun/moon toggle
│   ├── transactions/TransactionHistory.tsx
│   ├── ui/                       # shadcn/ui + custom motion wrappers
│   │   ├── motion.tsx            # FadeUp, HoverCard, StaggerContainer, etc.
│   │   ├── MouseFollower.tsx     # Premium blue glow follower
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   └── wallet/
│       ├── WalletConnectButton.tsx
│       ├── WalletDashboard.tsx
│       └── WalletModal.tsx        # Multi-wallet selection modal
│
├── contracts/
│   └── freelancer-milestone/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs            # Soroban smart contract (13 functions)
│           └── test.rs           # 6 passing tests
│
├── hooks/
│   ├── useContract.ts            # All contract read/write + mutations
│   ├── useBalances.ts            # Horizon XLM balance fetch
│   ├── useEvents.ts             # Real-time event polling (10s)
│   └── useProjects.ts           # Project listing helpers
│
├── lib/
│   ├── framer-variants.ts        # Animation variants
│   ├── stellar.ts                # Stellar RPC + Horizon config
│   └── utils.ts                  # cn() helper
│
├── scripts/
│   ├── deploy.ts                 # Contract deployment script
│   └── interact.ts               # Contract interaction script
│
├── store/
│   ├── walletStore.ts            # Zustand wallet state
│   ├── transactionStore.ts
│   ├── eventStore.ts
│   └── projectStore.ts
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── public/
├── .env                          # NEXT_PUBLIC_CONTRACT_ID
├── .env.example
├── .vercelignore
├── vercel.json
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Deployed Contract

| Property | Value |
|----------|-------|
| **Contract ID** | `CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ` |
| **Network** | Stellar Testnet |
| **RPC Endpoint** | `https://soroban-testnet.stellar.org` |
| **Explorer** | [View on stellar.expert](https://stellar.expert/explorer/testnet/contract/CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ) |
| **Wallet ID** | `GAQEKHOH4L6V4Y64KL2X3HDFAJ3DQKK6ZGGL4EPZKMKB4DWZF4V6FXW3` |
| **Freelancer Pay** | [Stellar Expert](https://stellar.expert/explorer/testnet/account/GAQEKHOH4L6V4Y64KL2X3HDFAJ3DQKK6ZGGL4EPZKMKB4DWZF4V6FXW3) |

> ⚠️ The contract is deployed on **Testnet**. Fund your wallet via the [Stellar Lab Friendbot](https://lab.stellar.org/account/create) before interacting.

## Contract Functions

| Function | Description | Auth |
|----------|-------------|------|
| `create_project` | Create a new project with milestones | Client |
| `accept_project` | Freelancer accepts a project | Freelancer |
| `deposit_milestone` | Client deposits XLM for a milestone | Client |
| `submit_milestone` | Freelancer submits milestone work | Freelancer |
| `approve_milestone` | Client approves milestone | Client |
| `release_payment` | Release payment to freelancer | Anyone |
| `cancel_project` | Client cancels an open project | Client |
| `get_project` | Read project details | — |
| `get_milestone` | Read milestone details | — |
| `get_client_projects` | Get all project IDs for a client | — |
| `get_freelancer_projects` | Get all project IDs for a freelancer | — |
| `get_project_milestones` | Get milestone IDs for a project | — |
| `get_project_count` | Total number of projects | — |

## Features

- **Multi-Wallet Support** — Connect with Freighter, xBull, Albedo, LOBSTR, Rabet, or Hana
- **Smart Contract Escrow** — Funds held in Soroban contract until milestone approval
- **Milestone Management** — Create projects with multiple milestones, each with its own budget
- **Role-Based Actions** — Clients deposit/approve, freelancers accept/submit
- **Real-Time Updates** — Event polling via Soroban RPC (10s interval)
- **Transaction Tracking** — Pending → success/failed with explorer links
- **Premium UI** — Light/dark themes, framer-motion animations, magnetic buttons, mouse-following glow
- **Responsive** — Mobile-first with scroll-aware navbar

## Getting Started

### Prerequisites

- Node.js 20+
- Rust (for smart contract development)
- Stellar CLI (`cargo install stellar-cli`)
- A Stellar wallet (Freighter recommended)

### Install & Run

```bash
git clone <repository-url>
cd ai-resume-builder
npm install

# Copy env and set your values
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network name | `testnet` |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Network passphrase | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_STELLAR_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed contract ID | `CBHBYWB6G3YC4Q56RUEXIMKD6FRUCQMAHUQKKMH2LY45KYVJZ7XMVGK4` |

### Build & Test

```bash
# Frontend
npm run build

# Smart contract
cd contracts/freelancer-milestone
cargo test                    # 6 tests
stellar contract build        # 13.7 KB WASM
```

## Deployment

### Vercel (Frontend)

The app is deployed at [https://ai-resume-builder-eta-nine.vercel.app](https://ai-resume-builder-eta-nine.vercel.app).

To redeploy:

```bash
npx vercel --prod
```

### Soroban (Contract)

```bash
# Build WASM
cd contracts/freelancer-milestone
stellar contract build

# Deploy (testnet)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/freelancer_milestone.wasm \
  --ignore-checks \
  --alias freelancer-milestone \
  --source <YOUR-KEY> \
  --network testnet
```

## Commit History

1. **Project Initialization & Wallet** — Next.js 15, StellarWalletsKit, multi-wallet, Zustand stores, wallet UI
2. **Smart Contract & Integration** — Soroban contract (13 functions), deployment scripts, React Query hooks, project modals
3. **Real-Time Events** — Event polling via Soroban RPC, activity feed, transaction history with status tracking
4. **UI Polish** — Dark/light themes, framer-motion animations, responsive layout, toast notifications, landing page redesign

## License

MIT
