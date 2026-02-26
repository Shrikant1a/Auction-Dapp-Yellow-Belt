# 🏆 AuraAuction - Premium Stellar Auction DApp

A high-end, real-time auction platform built on the **Stellar Network** using **Soroban Smart Contracts**. AuraAuction features a premium dark-themed aesthetic with glassmorphism effects, multi-wallet support, and advanced auction mechanics like anti-sniping.

![AuraAuction UI](public/icon.svg) <!-- Replace with a screenshot if available -->

## ✨ Features

- 💎 **Premium Aesthetic**: Curated "Luxury Gold" dark theme with glassmorphism.
- 🔌 **Multi-Wallet Support**: Integrated via Stellar Wallets Kit (Freighter, Albedo, xBull, Hana).
- ⛓️ **Soroban Powered**: Core logic executed on-chain for transparency and security.
- ⏱️ **Real-time Auction**: Dynamic countdown timer and live bid feed.
- 🛡️ **Anti-Sniping**: Automatic extension of auction time on late bids.
- 📊 **Bid Insights**: Visual bid progression graph and leaderboard.
- 🛒 **Activity Record**: Personalized "Your Activity" cart to track your bid history.
- 🔔 **Smart Notifications**: Real-time alerts for outbids and successful transactions.

---

## 🌐 Live Demo
[**Click here to view the Live Demo**](https://auction-dapp-yellow-belt.vercel.app/) 

---

## 📱 Mobile Responsive View
AuraAuction is fully optimized for mobile devices.
![Mobile View](https://via.placeholder.com/300x600.png?text=Mobile+Responsive+View) <!-- Please replace with your actual mobile screenshot -->

---

## ⚙️ CI/CD Status
![CI/CD Pipeline](https://github.com/YourUsername/YourRepo/actions/workflows/ci-cd.yml/badge.svg)
*(Automated build and linting active on every push)*

---

## 🎬 Demo Video
[**Watch the Demo Video**](https://link-to-your-video.com)

---

## ⛓️ Smart Contract Info
- **Auction Contract ID**: `CC...` (Replace with your actual ID)
- **NIPL Token Contract ID**: `CB...` (Replace with your actual ID)
- **Inter-contract Call**: The Auction contract calls the `transfer` function of the NIPL Token contract during the `place_bid` operation.
- **Network**: Stellar Testnet

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust & Cargo](https://www.rust-lang.org/tools/install)
- [Stellar CLI](https://developers.stellar.org/docs/smart-contracts/getting-started/setup#install-the-stellar-cli)
- [Freighter Wallet](https://www.freighter.app/) (Browser extension)

---

## 🛠 Step-by-Step Installation

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd auction-dapp-yellow
npm install
```

### 2. Smart Contract Setup (Soroban)
Navigate to the contract directory to build and deploy.

#### Build the Contract
```bash
cd contracts/auction_contract
stellar contract build
```

#### Deploy to Testnet
First, ensure you have a Testnet identity:
```bash
stellar keys generate --global dev-account --network testnet
```

Now deploy the WASM file:
```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/auction.wasm \
  --source dev-account \
  --network testnet
```
*Take note of the **Contract ID** returned by this command.*

#### Initialize the Auction
Replace `<CONTRACT_ID>` with your deployed ID:
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source dev-account \
  --network testnet \
  -- \
  initialize \
  --owner dev-account \
  --min_increment 10 \
  --starting_price 100 \
  --duration_secs 3600
```

### 3. Frontend Configuration
Go back to the root directory and configure your frontend to use the new contract.

Edit `app/lib/stellar.ts`:
```typescript
export const CONTRACT_ID = "YOUR_DEPLOYED_CONTRACT_ID_HERE";
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your DApp!

---

## 🏗 Project Structure

```text
├── app/                # Next.js App Router (Pages & Logic)
│   ├── lib/            # Stellar/Soroban utility functions
├── components/         # Reusable UI components
├── contracts/          # Rust Soroban smart contract
│   └── auction_contract/
├── public/             # Static assets (images, icons)
├── package.json        # Frontend dependencies & scripts
└── README.md           # Project documentation
```

## 📜 Key Scripts

- `npm run dev` - Starts the Next.js development server.
- `npm run build` - Creates an optimized production build.
- `stellar contract build` - Compiles the Rust contract to WASM.

## 🏗️ Requirements Status (Level 4 Completion)
- 💎 **Inter-contract Call**: Implemented escrow-style bidding with an inter-contract call from the `Auction` contract to the `NIPL` token contract.
- 🪙 **Custom Token**: Deployed `nipl_token` Soroban contract for platform-native transactions.
- ⚙️ **CI/CD**: Fully functional GitHub Actions pipeline for automated building and linting.
- 📱 **Mobile Responsive**: Fully optimized UI for all screen sizes using Tailwind's mobile-first design.
- 🚀 **Commit History**: 8+ meaningful architectural and feature-driven commits.
- 📦 **Advanced Deliverable**: Production-ready contract implementation with anti-sniping and token integration.

---

Built with ❤️ for the Stellar Ecosystem.

---

## 🚀 How to Deploy to Vercel (Live Demo)

To host your DApp online for others to use, follow these steps:

### 1. Push to GitHub
If you haven't already, upload your code to a GitHub repository.

### 2. Connect to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New"** > **"Project"**.
3. Import your `Auction-Dapp-Yellow-Belt` repository.

### 3. Configure Build Settings
Vercel should automatically detect Next.js. Most settings are default:
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. Deploy!
Click **"Deploy"**. Once finished, Vercel will provide you with a production URL (e.g., `https://auction-dapp.vercel.app`).

### 5. Update README
Copy the URL provided by Vercel and paste it into the **Live Demo** section at the top of this `README.md`.
