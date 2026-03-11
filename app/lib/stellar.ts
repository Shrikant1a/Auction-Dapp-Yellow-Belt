import { Horizon, Networks, rpc, Contract, TransactionBuilder, Address, xdr, nativeToScVal, Account, scValToNative } from '@stellar/stellar-sdk';

export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const AUCTION_CONTRACT_ID = 'CDNIYIJSTGTVOYLIKGDQQSWAYUTLJBV3JOGUURMYYS43FS2S4L5W3LX6';
export const NIPL_TOKEN_ID = 'CAESCEJMOCXUMAU676QCLMJXDLT7UZUS5HJQTLAJTDLAFHWNMWQBBN4V';

export const server = new Horizon.Server(HORIZON_URL);
export const rpcServer = new rpc.Server(RPC_URL);

// Contract calling helper

export async function getAuctionState() {
  const contract = new Contract(AUCTION_CONTRACT_ID);
  try {
    const tx = new TransactionBuilder(
      new Account("GCDBFMGKDV2GMLVNLUBV7MHBF7LFPWAJGYWBJTHHSZNLVG44LTZXJGT7", "0"),
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call("get_auction"))
      .setTimeout(30)
      .build();

    const simulation = await rpcServer.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      return scValToNative(simulation.result.retval);
    }
  } catch (e) {
    console.error("Error fetching auction state:", e);
  }
  return null;
}

// Contract calling helper
export async function placeBidOnChain(userAddress: string, amount: number, signFn: (xdr: string) => Promise<string>) {
  const contract = new Contract(AUCTION_CONTRACT_ID);

  // 1. Fetch account sequence
  const sourceAccount = await server.loadAccount(userAddress);

  // 2. Build Transaction
  const tx = new TransactionBuilder(sourceAccount, {
    fee: '10000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'place_bid',
        nativeToScVal(userAddress, { type: 'address' }),
        nativeToScVal(BigInt(amount), { type: 'i128' })
      )
    )
    .setTimeout(30)
    .build();

  // 3. Simulate (Soroban requires simulation to set footprint/fees)
  const simulation = await rpcServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(`Simulation failed: ${simulation.error} `);
  }

  const preparedTx = rpc.assembleTransaction(tx, simulation).build();

  // 4. Sign
  const signedXDR = await signFn(preparedTx.toXDR());

  // 5. Submit
  const response = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE));

  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed: ${JSON.stringify(response.errorResult)} `);
  }

  return response.hash;
}

// Event listening placeholder logic
export async function getRecentEvents(startLedger?: number) {
  try {
    const latestLedger = (await rpcServer.getLatestLedger()).sequence;
    const start = startLedger || Math.max(latestLedger - 100, 1);

    const response = await rpcServer.getEvents({
      startLedger: start,
      filters: [
        {
          type: 'contract',
          contractIds: [AUCTION_CONTRACT_ID],
        },
      ],
      limit: 10,
    });
    return response.events;
  } catch (e) {
    console.error("Error fetching events:", e);
    return [];
  }
}

// Token connection helper
export async function getNIPLBalance(userAddress: string) {
  const contract = new Contract(NIPL_TOKEN_ID);
  try {
    const tx = new TransactionBuilder(
      new Account(userAddress, "0"),
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call("balance", nativeToScVal(userAddress, { type: 'address' })))
      .setTimeout(30)
      .build();

    const simulation = await rpcServer.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      return scValToNative(simulation.result.retval);
    }
  } catch (e) {
    console.error("Error fetching NIPL balance:", e);
  }
  return 0;
}

// Finalize helper
export async function finalizeAuctionOnChain(userAddress: string, signFn: (xdr: string) => Promise<string>) {
  const contract = new Contract(AUCTION_CONTRACT_ID);
  const sourceAccount = await server.loadAccount(userAddress);
  const tx = new TransactionBuilder(sourceAccount, {
    fee: '10000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call('finalize'))
    .setTimeout(30)
    .build();

  const simulation = await rpcServer.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(`Simulation failed: ${simulation.error}`);
  }

  const preparedTx = rpc.assembleTransaction(tx, simulation).build();
  const signedXDR = await signFn(preparedTx.toXDR());
  const response = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE));

  if (response.status === 'ERROR') {
    throw new Error(`Transaction failed: ${JSON.stringify(response.errorResult)}`);
  }

  return response.hash;
}



interface WalletAPI {
  isFreighter?: boolean;
  getPublicKey?: () => Promise<string | { publicKey: string }>;
  publicKey?: (args?: unknown) => Promise<{ pubkey: string } | string>;
  pubkey?: string;
  isConnected?: () => Promise<boolean>;
  signTransaction?: (xdr: string, options: { network: string }) => Promise<string | { signedXDR?: string; xdr?: string }>;
}

declare global {
  interface Window {
    freighterApi?: WalletAPI;
    stellar?: WalletAPI;
    albedo?: WalletAPI;
  }
}

// Native Wallet Support (No library dependency)
export async function connectWallet() {
  if (typeof window !== 'undefined') {
    console.log("Starting wallet detection...");

    // 1. Explicit Freighter Check
    const freighter = window.freighterApi;
    const stellar = window.stellar;

    const isFreighterAvailable = freighter || (stellar && stellar.isFreighter);

    if (isFreighterAvailable) {
      try {
        console.log("Found Freighter-compatible API");
        const api = freighter || stellar;

        if (api && typeof api.isConnected === 'function') {
          const connected = await api.isConnected();
          console.log("Freighter isConnected:", connected);
        }

        const publicKey = api && typeof api.getPublicKey === 'function' ? await api.getPublicKey() : null;
        console.log("Freighter getPublicKey result:", publicKey);

        if (publicKey) return typeof publicKey === 'string' ? publicKey : publicKey.publicKey;
      } catch (err: unknown) {
        console.error("Freighter API Error:", err);

        if (err instanceof Error) {
          if (err.message.includes("User declined")) {
            throw new Error("Connection denied by user. Please unlock your wallet and try again.");
          }
        }
      }
    }
  }

  // 2. Generic Stellar Check (xBull, Hana, etc.)
  // if (typeof window !== "undefined" && (window as any).stellar && !(window as any).stellar.isFreighter) {
  //   try {
  //     console.log("Detecting Generic Stellar Wallet (xBull/Hana)...");
  //     const publicKey = typeof stellar.getPublicKey === 'function'
  //       ? await stellar.getPublicKey()
  //       : typeof stellar.publicKey === 'function'
  //         ? await stellar.publicKey()
  //         : null;

  //     if (publicKey) {
  //       const addr = typeof publicKey === 'object' ? publicKey.publicKey || publicKey.pubkey : publicKey;
  //       if (addr) return addr;
  //     }
  //   } catch (e) {
  //     console.error("Generic Wallet Error:", e);
  //   }
  // }
  // 2. Generic Stellar Check (xBull, Hana, etc.)
  if (typeof window !== "undefined") {
    const stellar = window.stellar;

    if (stellar && !stellar.isFreighter) {
      try {
        console.log("Detecting Generic Stellar Wallet (xBull/Hana)...");

        const publicKey =
          typeof stellar.getPublicKey === "function"
            ? await stellar.getPublicKey()
            : typeof stellar.publicKey === "function"
              ? await stellar.publicKey()
              : null;

        if (publicKey) {
          const addr =
            typeof publicKey === "object"
              ? (publicKey as { publicKey?: string; pubkey?: string }).publicKey || (publicKey as { publicKey?: string; pubkey?: string }).pubkey
              : publicKey;

          if (addr) return addr;
        }
      } catch (err: unknown) {
        console.error("Generic Wallet Error:", err);
      }
    }
  }


  // 3. Albedo
  if (typeof window !== 'undefined' && window.albedo) {
    try {
      console.log("Detecting Albedo...");
      const res = typeof window.albedo.publicKey === 'function' ? await window.albedo.publicKey({}) : null;
      if (res && typeof res !== 'string' && 'pubkey' in res) {
        return res.pubkey;
      }
    } catch (err: unknown) {
      console.error("Albedo Error:", err);
    }
  }

  throw new Error("No Stellar wallet detected. 1. Unlock your extension 2. Refresh the page 3. Ensure this site is allowed in settings.");
}


export async function signTransaction(xdr: string) {
  if (typeof window !== 'undefined') {
    // 1. Try Freighter
    const freighter = window.freighterApi;
    if (freighter && typeof freighter.signTransaction === 'function') {
      try {
        const signedXDR = await freighter.signTransaction(xdr, {
          network: 'TESTNET',
        });
        return typeof signedXDR === 'string' ? signedXDR : signedXDR.signedXDR || signedXDR.xdr || "";
      } catch (err: unknown) {
        console.error("Freighter Sign Error:", err);
      }
    }

    // 2. Try Generic Stellar (xBull, etc.)
    const genericStellar = window.stellar;
    if (genericStellar && typeof genericStellar.signTransaction === 'function') {
      try {
        const result = await genericStellar.signTransaction(xdr, {
          network: 'TESTNET',
        });
        // Handle if it returns {signedXDR: ...} or just string
        if (typeof result === 'object' && result !== null) {
          return (result as { signedXDR?: string; xdr?: string }).signedXDR || (result as { signedXDR?: string; xdr?: string }).xdr || "";
        }
        return result || "";
      } catch (err: unknown) {
        console.error("Generic Sign Error:", err);
      }
    }
  }
  throw new Error("Wallet not available for signing. Ensure your wallet extension is unlocked.");
}
