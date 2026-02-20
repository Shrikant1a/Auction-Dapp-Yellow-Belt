# Developer Guide - AuraAuction DApp

This guide explains how to continue building and deploy the AuraAuction DApp.

## 🛠 Prerequisites

- **Stellar CLI**: Already installed in the environment.
- **Rust & Cargo**: Installed, but requires `wasm32-unknown-unknown` target and MSVC build tools (for Windows users).
- **Node.js**: v18+ recommended.

## 📦 Smart Contract (Soroban)

The contract is located in `contracts/auction_contract`.

### 1. Build
```bash
cd contracts/auction_contract
stellar contract build
```
*Note: If building on Windows fails due to missing linkers, consider using WSL or ensuring "Desktop development with C++" is installed via Visual Studio Installer.*

### 2. Deploy (Testnet)
```bash
# Set up a testnet identity if you haven't
stellar keys generate --global alice --network testnet

# Deploy
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/auction.wasm \
  --source alice \
  --network testnet
```

### 3. Initialize Auction
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --owner alice \
  --min_increment 10 \
  --starting_price 100 \
  --duration_secs 3600
```

## 🌐 Frontend (Next.js)

The frontend is located in the root directory.

### 1. Configuration
Update `app/lib/stellar.ts` with your deployed Contract ID.

### 2. Development Server
```bash
npm run dev
```

### 3. Current Mock State
The current dashboard simulates the auction behavior (timer, bidding, feed) to showcase the premium UI. To connect real data:
1. Uncomment the `connectWallet` calls in `app/page.tsx`.
2. Implement the `place_bid` transaction logic using `@stellar/stellar-sdk`.
3. Use the `server.events().forContract()` API to listen for real-time bid events.

## 🎨 Aesthetic Guidelines
- **Color Palette**: Use `#fbbf24` (Gold) for accents and `#0a0a0a` for deep backgrounds.
- **Glassmorphism**: Use the `.glass` class for cards and navbars.
- **Typography**: Heavily utilizes font-black weights for headings to create a premium "luxury" feel.
