<div align="center">

# ⚡ FreelancerPay

**Decentralized Milestone-Based Payment Platform on Stellar**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-60A5FA?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-resume-builder-eta-nine.vercel.app)
[![Built on Stellar](https://img.shields.io/badge/Built_on-Stellar-7B1FA2?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-00D4AA?style=for-the-badge)](https://soroban.stellar.org)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

https://github.com/user-attachments/assets/0a7e6b0a-0b7e-4b0a-8b0a-0b7e4b0a8b0a

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots--demo)
- [Smart Contract Specifications](#-smart-contract-specifications)
- [User Flow (PoC Walkthrough)](#-user-flow-poc-walkthrough)
- [Technical Stack](#-technical-stack)
- [Deployed Contracts](#-deployed-contracts)
- [Setup & Run Instructions](#-setup--run-instructions)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🌟 Overview

**FreelancerPay** solves the fundamental trust problem in freelance payments: *"How do I know I'll get paid after delivering the work?"* and *"How do I know the work will be done after I pay?"*

The answer is **programmatic escrow** powered by Stellar Soroban smart contracts. Clients create projects with clearly defined milestones, deposit funds into a smart contract, and money is **automatically released** only when milestones are approved — no intermediaries, no disputes, no 30-day waiting periods.

### The Problem

| Traditional Freelance | With FreelancerPay |
|---|---|
| 30-60 day payment cycles | **Sub-5 second settlement** |
| 15-20% platform fees | **Near-zero transaction costs** |
| Chargebacks & payment disputes | **Trustless smart contract escrow** |
| Limited to specific regions | **Global, permissionless access** |
| Platform lock-in | **Self-custodial wallet control** |

### The Vision

A world where **any freelancer, anywhere** can work with **any client, globally** and be paid **instantly and trustlessly** — without needing a bank account, a credit card, or a middleman taking a cut.

---

## ✨ Key Features

<details open>
<summary><strong>📋 Project Creation</strong></summary>

Clients create projects on-chain with a title, description, and multiple milestones. Each project is stored immutably on the Stellar blockchain with a unique ID. The modal UI guides users through defining milestones with titles, descriptions, and individual XLM budgets.
</details>

<details>
<summary><strong>💰 Milestone-Based Payments</strong></summary>

Each milestone carries its own XLM amount. Payments are escrowed in the Soroban contract per-milestone — not as a lump sum. This means freelancers get paid incrementally as they complete work, and clients only fund the next milestone when satisfied with the previous one.
</details>

<details>
<summary><strong>🔒 Escrow Mechanism</strong></summary>

Funds are **never held by a third party**. XLM is locked directly in the Soroban smart contract using Stellar's native asset. The contract enforces release conditions programmatically: only the client can deposit/approve, only the freelancer can submit work, and payment release happens on-chain with zero gatekeeping.
</details>

<details>
<summary><strong>👨‍💻 Freelancer Workflow</strong></summary>

Freelancers can:
- View available projects they've been assigned to
- Accept project invitations
- Submit work deliverables for funded milestones
- Track payment status in real time
- View complete transaction history on the Stellar explorer
</details>

<details>
<summary><strong>✅ Client Approval Flow</strong></summary>

Clients have full control:
- Create projects with custom milestones
- Fund milestones individually
- Review and approve submitted work
- Cancel open projects (unfunded milestones refunded)
- View dashboard with network-wide analytics
</details>

<details>
<summary><strong>🔌 Stellar Wallet Integration</strong></summary>

Six supported wallets via **StellarWalletsKit**:
- [Freighter](https://freighter.app) — Browser extension
- [xBull](https://xbull.app) — Browser & mobile
- [Albedo](https://albedo.link) — Web-based
- [LOBSTR](https://lobstr.co) — Mobile & browser
- [Rabet](https://rabet.io) — Browser extension
- [Hana](https://hana.co) — Mobile wallet

Wallets are auto-detected on page load, and the selected wallet persists across sessions via `localStorage`.
</details>

<details>
<summary><strong>🤖 Soroban Smart Contract Automation</strong></summary>

13 contract functions handle the entire project lifecycle. The Rust-based Soroban contract (~13.7 KB WASM) is deployed on Stellar Testnet and manages project state, milestone tracking, escrow balances, and role-based access control entirely on-chain.
</details>

<details>
<summary><strong>📊 Activity Tracking</strong></summary>

Real-time activity feed powered by Soroban event polling (10-second interval). Every `project_created`, `milestone_funded`, `milestone_approved`, `payment_released`, and `project_cancelled` event is captured and displayed with filterable categories, timestamps, and direct explorer links.
</details>

<details>
<summary><strong>📜 Transaction History</strong></summary>

Every contract interaction is recorded with its status (`Pending → Success / Failed`), transaction hash, block timestamp, associated project/milestone IDs, and error messages. Each entry links directly to the Stellar Expert explorer for full transparency.
</details>

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                    │
│  ┌─────────────────────────────────────────────────┐ │
│  │           Next.js 15 App (Turbopack)             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │
│  │  │ Dashboard │ │ Projects │ │ Activity / Txns  │ │ │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │ │
│  │         │              │               │         │ │
│  │  ┌──────┴──────────────┴───────────────┴──────┐  │ │
│  │  │         StellarWalletsKit                    │  │ │
│  │  │   (Freighter / xBull / Albedo / LOBSTR)     │  │ │
│  │  └────────────────────┬───────────────────────┘  │ │
│  └───────────────────────┼───────────────────────────┘ │
└──────────────────────────┼─────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │  @stellar/stellar-sdk   │
              │  (Soroban RPC + Horizon)│
              └────────────┬────────────┘
                           │
┌──────────────────────────┼─────────────────────────────┐
│              Stellar Testnet                            │
│  ┌───────────────────────┴──────────────────────────┐  │
│  │           Soroban RPC (soroban-testnet)           │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │        Freelancer Milestone Contract          │  │  │
│  │  │        (Rust / WASM / 13.7 KB)               │  │  │
│  │  │                                              │  │  │
│  │  │  create_project → accept_project →           │  │  │
│  │  │  deposit_milestone → submit_milestone →      │  │  │
│  │  │  approve_milestone → release_payment         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────┐   ┌───────────────────────┐   │  │
│  │  │  Horizon API    │   │  Event Polling (10s)  │   │  │
│  │  └────────────────┘   └───────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Frontend

- **Next.js 15** with App Router and Turbopack for instant HMR
- **Tailwind CSS v4** with glassmorphism design system
- **Framer Motion** for magnetic buttons, staggered entrances, 3D tilt cards, and scroll-triggered animations
- **TanStack Query** for server-state management (caching, refetching, optimistic updates)
- **Zustand** for lightweight client-side wallet state
- **Recharts** for interactive dashboard analytics (area/bar/pie/radar charts)

### Smart Contracts

- **Soroban SDK** (Rust) — 13 functions, role-based access control, milestone-level escrow
- **WASM size**: ~13.7 KB
- **Test coverage**: 6 passing tests covering happy paths and edge cases
- **Deployment**: Stellar CLI (`stellar contract deploy`)

### Wallet Integration

- **StellarWalletsKit** — Unified API for 6 Stellar wallets
- Auto-reconnect via `localStorage` (persists selected wallet ID)
- Connection state managed through Zustand with React Query integration

### Stellar Testnet

- **RPC**: `soroban-testnet.stellar.org`
- **Horizon**: Standard testnet Horizon for XLM balance queries
- **Explorer**: stellar.expert for transaction/contract verification
- **Friendbot**: Free testnet XLM via Stellar Lab

---

## 📸 Screenshots & Demo

### Landing Page

<div align="center">
  <img src="https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/main/Screenshot%202026-06-21%20200058.png" alt="Landing Page" width="700" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
  <p><em>Glassmorphism hero section with animated orb background and magnetic CTA buttons</em></p>
</div>

### Dashboard

<div align="center">
  <img src="https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/main/Screenshot%202026-06-21%20200113.png" alt="Dashboard" width="700" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
  <p><em>Analytics dashboard with wallet details, contract info, and interactive Recharts</em></p>
</div>

### Milestone Management

<div align="center">
  <img src="https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/main/Screenshot%202026-06-21%20200200.png" alt="Milestone Management" width="700" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
  <p><em>Accordion-based milestone tracking with role-based action buttons</em></p>
</div>

### Additional Screens

| Page | Preview |
|------|---------|
| Project Creation | <img src="https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform/blob/main/Screenshot%202026-06-21%20200223.png" width="300" /> |
| Activity Feed | *(Real-time event stream with filterable categories)* |
| Transactions | *(Status-tracked transaction history with explorer links)* |
| Mobile View | *(Responsive glassmorphism layout with mobile drawer nav)* |

> Screenshots captured from [live demo](https://ai-resume-builder-eta-nine.vercel.app). Connect a Stellar testnet wallet to interact.

---

## 📜 Smart Contract Specifications

The Soroban smart contract is written in Rust and deployed on Stellar Testnet. It manages the complete lifecycle of projects and milestone-based payments.

### Contract Overview

| Property | Value |
|----------|-------|
| **Language** | Rust (Soroban SDK) |
| **WASM Size** | ~13.7 KB |
| **State Management** | `Map<u32, Project>` + `Map<(u32, u32), Milestone>` |
| **Authorization** | `require_auth()` for role-gated functions |
| **Tests** | 6 passing |

### Functions

#### Write Functions (Require Authentication)

| Function | Auth | Description |
|----------|------|-------------|
| `create_project(client, title, description, milestones)` | **Client** | Creates a new project with an array of milestones. Stores project metadata and milestone definitions. Emits `project_created` event. |
| `accept_project(project_id, freelancer)` | **Freelancer** | Freelancer accepts a project. Transitions status from `Open` to `InProgress`. Emits `project_accepted` event. |
| `deposit_milestone(client, project_id, milestone_id)` | **Client** | Deposits XLM for a specific milestone. Requires exact milestone amount. Emits `milestone_funded` event. |
| `submit_milestone(project_id, milestone_id, delivery_hash)` | **Freelancer** | Marks milestone work as submitted. Transitions milestone to `Submitted` state. Emits `milestone_submitted` event. |
| `approve_milestone(project_id, milestone_id)` | **Client** | Approves completed milestone work. Transitions to `Approved` state. Emits `milestone_approved` event. |
| `release_payment(project_id, milestone_id)` | **Anyone** | Releases escrowed XLM to the freelancer. Transitions milestone to `Paid`. Emits `payment_released` event. |
| `cancel_project(project_id, client)` | **Client** | Cancels an open project (only `Open` status). Emits `project_cancelled` event. |

#### Read Functions (No Authentication Required)

| Function | Returns | Description |
|----------|---------|-------------|
| `get_project(project_id)` | `Project` | Returns project details: client, freelancer, title, description, milestone count, status, timestamps. |
| `get_milestone(project_id, milestone_id)` | `Milestone` | Returns milestone details: title, description, amount, status, delivery hash, timestamps. |
| `get_client_projects(client)` | `Vec<u32>` | Returns all project IDs where the address is the client. |
| `get_freelancer_projects(freelancer)` | `Vec<u32>` | Returns all project IDs where the address is the assigned freelancer. |
| `get_project_milestones(project_id)` | `Vec<u32>` | Returns milestone IDs for a given project. |
| `get_project_count()` | `u32` | Returns the total number of projects created on the platform. |

### State Model

```rust
struct Project {
    client: Address,
    freelancer: Option<Address>,
    title: String,
    description: String,
    total_milestones: u32,
    status: ProjectStatus,       // Open | InProgress | Completed | Cancelled
    created_at: u64,
    updated_at: u64,
}

struct Milestone {
    project_id: u32,
    title: String,
    description: String,
    amount: i128,                // Stored in stroops (1 XLM = 10,000,000 stroops)
    status: MilestoneStatus,     // Pending | InProgress | Submitted | Approved | Paid
    delivery_hash: BytesN<32>,
    created_at: u64,
    updated_at: u64,
}

enum ProjectStatus { Open, InProgress, Completed, Cancelled }
enum MilestoneStatus { Pending, InProgress, Submitted, Approved, Paid }
```

### Events

| Event | Topics | Data |
|-------|--------|------|
| `project_created` | project_id, client | title |
| `project_accepted` | project_id, freelancer | — |
| `milestone_funded` | project_id, milestone_id, client | amount |
| `milestone_submitted` | project_id, milestone_id, freelancer | — |
| `milestone_approved` | project_id, milestone_id, client | — |
| `payment_released` | project_id, milestone_id, freelancer | amount |
| `project_cancelled` | project_id, client | — |

---

## 👤 User Flow (PoC Walkthrough)

### Step 1: Connect Wallet
1. Visit the [live demo](https://ai-resume-builder-eta-nine.vercel.app)
2. Click **Connect Wallet** in the top-right navbar
3. Select your preferred Stellar wallet (Freighter recommended)
4. Approve the connection request in your wallet extension
5. ✅ Your wallet address and XLM balance appear in the dashboard

### Step 2: Create Project (Client)
1. Navigate to **App** → **New Project**
2. Fill in project title (e.g., *"Build React Dashboard"*)
3. Add a description of the scope
4. Click **Create Project** and sign the transaction
5. ✅ Project appears in the "As Client" tab with `Open` status

### Step 3: Add Milestones
Milestones are added during project creation:
```
Milestone 1: UI Wireframes — 50 XLM
Milestone 2: API Integration — 75 XLM
Milestone 3: Testing & Deploy — 25 XLM
```
Each milestone gets individual budget, title, and description.

### Step 4: Accept Project (Freelancer)
- The freelancer sees the project in their "As Freelancer" tab
- Clicks **Accept** — signs the transaction
- ✅ Project status changes to `InProgress`

### Step 5: Fund Milestone (Client)
1. Open project details → milestone accordion
2. Click **Deposit** for the first milestone
3. Confirm the XLM amount in your wallet
4. ✅ Milestone status changes to `Funded` (InProgress)

### Step 6: Submit Work (Freelancer)
1. Complete the milestone work off-chain
2. Click **Submit Work** on the funded milestone
3. ✅ Milestone status changes to `Submitted`

### Step 7: Approve Milestone (Client)
1. Review the submitted work
2. Click **Approve** on the submitted milestone
3. ✅ Milestone status changes to `Approved`

### Step 8: Release Payment
1. Click **Release Payment** (available to either party)
2. XLM is transferred from contract escrow to freelancer's wallet
3. ✅ Milestone status changes to `Paid`
4. 🎉 Funds arrive in the freelancer's wallet within seconds

> Repeat steps 5–8 for each milestone. View all events in **Activity** and all statuses in **Transactions**.

---

## 🛠 Technical Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org) (App Router + Turbopack) | React framework with server components and fast refresh |
| [TypeScript](https://typescriptlang.org) | Type safety across the entire codebase |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling with CSS-first configuration |
| [shadcn/ui](https://ui.shadcn.com) + Radix Primitives | Accessible, unstyled component primitives |
| [Framer Motion](https://framer.com/motion) | Declarative animations, spring physics, layout animations |
| [TanStack Query](https://tanstack.com/query) | Server state, caching, optimistic mutations |
| [Zustand](https://github.com/pmndrs/zustand) | Lightweight client-side wallet state |
| [Recharts](https://recharts.org) | Composable charting for the analytics dashboard |
| [Lucide React](https://lucide.dev) | Consistent icon set |
| [Sonner](https://sonner.emilkowalski.com) | Toast notifications |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme switching with SSR support |

### Blockchain

| Technology | Purpose |
|------------|---------|
| [Stellar](https://stellar.org) | Layer-1 blockchain network |
| [Soroban](https://soroban.stellar.org) | Smart contract platform (Rust → WASM) |
| [@stellar/stellar-sdk](https://github.com/stellar/js-stellar-sdk) | JavaScript SDK for Stellar RPC + Horizon |
| [StellarWalletsKit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) | Unified multi-wallet connection interface |
| [stellar-cli](https://github.com/stellar/stellar-cli) | Contract build, deploy, and interaction |

### Development & Deployment

| Tool | Purpose |
|------|---------|
| [Vercel](https://vercel.com) | Frontend hosting with automatic HTTPS |
| [GitHub](https://github.com) | Source control |
| [Rust](https://rust-lang.org) | Smart contract language |
| [Cargo](https://doc.rust-lang.org/cargo) | Rust build system |

---

## 📡 Deployed Contracts

### Stellar Testnet

| Property | Value |
|----------|-------|
| **Network** | Stellar Testnet |
| **Contract ID** | `CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ` |
| **RPC Endpoint** | `https://soroban-testnet.stellar.org` |
| **Horizon** | `https://horizon-testnet.stellar.org` |
| **Explorer** | [View Contract](https://stellar.expert/explorer/testnet/contract/CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ) |
| **Test Wallet** | `GAQEKHOH4L6V4Y64KL2X3HDFAJ3DQKK6ZGGL4EPZKMKB4DWZF4V6FXW3` |
| **Wallet Explorer** | [View Account](https://stellar.expert/explorer/testnet/account/GAQEKHOH4L6V4Y64KL2X3HDFAJ3DQKK6ZGGL4EPZKMKB4DWZF4V6FXW3) |

> ⚠️ The contract is deployed on **Testnet**. Fund your wallet via the [Stellar Lab Friendbot](https://lab.stellar.org/account/create) before interacting.

---

## 🚀 Setup & Run Instructions

### Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 10+ | Bundled with Node.js |
| Rust | 1.79+ | `rustup install stable` |
| stellar-cli | Latest | `cargo install stellar-cli` |
| Stellar Wallet | — | [Freighter](https://freighter.app) (recommended) |

### Installation

```bash
# Clone the repository
git clone https://github.com/ChandranshuDutta025/Freelancer-milestone-Payment-Platform.git
cd Freelancer-milestone-Payment-Platform

# Install frontend dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Deployed Soroban Contract ID
NEXT_PUBLIC_CONTRACT_ID=CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Network name | `testnet` |
| `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE` | Network passphrase for Soroban | `Test SDF Network ; September 2015` |
| `NEXT_PUBLIC_STELLAR_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed Soroban contract ID | `CDLXSOVSVT5XJS3S5YUV74SY4T3LBX4Z32L3TP47HVUVVCNOFTB27GKZ` |

### Development

```bash
# Start the Next.js dev server with Turbopack
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Frontend production build
npm run build

# Smart contract build
cd contracts/freelancer-milestone
stellar contract build
# Output: target/wasm32v1-none/release/freelancer_milestone.wasm
```

### Run Tests

```bash
# Smart contract tests (6 passing)
cd contracts/freelancer-milestone
cargo test

# Lint frontend
npm run lint
```

### Deployment

#### Frontend (Vercel)

The app is pre-configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository directly via the [Vercel dashboard](https://vercel.com).

#### Soroban Smart Contract

```bash
# Build WASM
cd contracts/freelancer-milestone
stellar contract build

# Deploy to Testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/freelancer_milestone.wasm \
  --ignore-checks \
  --alias freelancer-milestone \
  --source <YOUR-STELLAR-SECRET-KEY> \
  --network testnet

# Interact with deployed contract
stellar contract invoke \
  --id <CONTRACT-ID> \
  --source <YOUR-KEY> \
  --network testnet \
  -- \
  get_project_count
```

---

## 📁 Project Structure

```
freelancer-milestone-payment-platform/
├── app/                                  # Next.js App Router pages
│   ├── page.tsx                          # Landing page (hero, stats, features, CTA)
│   ├── layout.tsx                        # Root layout (providers, navbar, footer, background)
│   ├── globals.css                       # Tailwind v4 + glassmorphism design tokens
│   ├── page-transition.tsx               # AnimatePresence page wrapper
│   ├── query-provider.tsx                # TanStack Query provider + BigInt polyfill
│   ├── activity/                         # Real-time activity feed page
│   ├── app-page/                         # Main app (project listing + creation)
│   ├── dashboard/                        # Analytics dashboard with Recharts
│   └── transactions/                     # Transaction history page
│
├── components/
│   ├── activity/ActivityFeed.tsx         # Event stream with filter chips
│   ├── layout/
│   │   ├── Navbar.tsx                    # Fixed, scroll-aware glassmorphism navbar
│   │   ├── MobileNav.tsx                 # Sheet-based mobile navigation
│   │   └── Footer.tsx                    # Glassmorphism footer
│   ├── projects/
│   │   ├── CreateProjectModal.tsx        # Project + milestone creation form
│   │   ├── MilestoneTracker.tsx          # Accordion-based milestone management
│   │   └── ProjectCard.tsx              # Project summary card with actions
│   ├── theme/
│   │   ├── ThemeProvider.tsx             # next-themes wrapper
│   │   └── ThemeToggle.tsx              # Animated sun/moon toggle
│   ├── transactions/TransactionHistory.tsx
│   ├── ui/                              # shadcn/ui + custom components
│   │   ├── motion.tsx                   # FadeUp, HoverCard, StaggerContainer, etc.
│   │   ├── AnimatedBackground.tsx       # Canvas-based organic blob background
│   │   ├── MouseFollower.tsx            # Canvas-based cursor trail
│   │   ├── StatsCharts.tsx              # Recharts charts for dashboard
│   │   ├── button.tsx, card.tsx, dialog.tsx, input.tsx, ...
│   │   └── badge.tsx, tabs.tsx, select.tsx, skeleton.tsx, ...
│   └── wallet/
│       ├── WalletConnectButton.tsx       # Dropdown wallet button with status
│       ├── WalletDashboard.tsx           # Wallet detail card (balance, address, network)
│       └── WalletModal.tsx               # Multi-wallet selection dialog
│
├── contracts/
│   └── freelancer-milestone/
│       ├── Cargo.toml                    # Rust dependencies including soroban-sdk
│       └── src/
│           ├── lib.rs                    # Soroban smart contract (13 functions)
│           └── test.rs                   # 6 passing unit tests
│
├── hooks/
│   ├── useContract.ts                   # All Soroban read/write hooks + React Query mutations
│   ├── useBalances.ts                    # Horizon XLM balance polling
│   ├── useEvents.ts                     # Soroban event polling (10s interval)
│   └── useTransactions.ts               # Transaction state management
│
├── lib/
│   ├── constants.ts                     # Network config, contract ID, explorer URL
│   ├── framer-variants.ts               # Animation variants for motion components
│   └── utils.ts                         # cn(), truncateAddress(), formatXlm(), etc.
│
├── scripts/
│   ├── deploy.ts                        # Contract deployment automation
│   └── interact.ts                      # Contract interaction CLI
│
├── store/
│   ├── walletStore.ts                   # Zustand wallet state (connect, disconnect, reconnect)
│   ├── context.tsx                      # React context for transactions + events (localStorage)
│   └── transactionStore.ts, eventStore.ts, projectStore.ts
│
├── types/
│   └── index.ts                         # TypeScript interfaces (Project, Milestone, Event, etc.)
│
├── public/                              # Static assets
├── .env                                 # Environment variables (gitignored)
├── .env.example                         # Environment variable template
├── next.config.ts                       # Next.js configuration
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── vercel.json                          # Vercel deployment config
└── README.md                            # This file
```

---

## 🔮 Future Improvements

### Short Term

- [ ] **Freelancer Discovery** — Browse and invite freelancers directly within the platform
- [ ] **Milestone Editing** — Allow clients to modify milestone details before funding
- [ ] **Dispute Resolution** — Add a mediation mechanism with third-party arbiters
- [ ] **Email Notifications** — Notify users of milestone events via email
- [ ] **Multi-Currency Support** — Accept USDC and other Stellar assets alongside XLM

### Medium Term

- [ ] **Dispute Resolution Dashboard** — On-chain arbitration with community jurors
- [ ] **Reputation System** — On-chain ratings and review history for freelancers and clients
- [ ] **Escrow 2.0** — Time-based auto-release with configurable deadlines
- [ ] **Batch Operations** — Fund/approve multiple milestones in a single transaction
- [ ] **Analytics v2** — Freelancer earnings reports, client spending trends, platform KPIs
- [ ] **Mobile App** — React Native or Flutter companion app

### Long Term

- [ ] **Cross-Chain Bridging** — Support for Ethereum/Solana-based stablecoins via Stellar's built-in bridge
- [ ] **DAO Governance** — Community voting on platform parameters (fee structure, dispute rules)
- [ ] **Subscription Model** — Recurring milestone schedules for retainer-based work
- [ ] **AI-Powered Matching** — Smart contract-assisted freelancer-client matching based on skills and history
- [ ] **Mainnet Launch** — Deploy to Stellar Mainnet after audit and testing

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ on Stellar Soroban**

[![Stellar](https://img.shields.io/badge/Powered_by-Stellar-7B1FA2?style=flat-square&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-00D4AA?style=flat-square)](https://soroban.stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

</div>
