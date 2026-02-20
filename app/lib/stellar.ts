import {
  StellarWalletsKit,
  WalletNetwork,
  AllowAllModules,
  FREIGHTER_ID
} from '@stellar/stellar-wallets-kit';
import { Horizon, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const AUCTION_CONTRACT_ID = 'CDGC73EHRGV7GUYDTZ7UCLREY7NDBB7AI75Q7NFPO7Q24RAZYLS6SI6NO';

export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: AllowAllModules,
});

export const server = new Horizon.Server(HORIZON_URL);

export async function connectWallet() {
  const { address } = await kit.getAddress();
  return address;
}

export async function signTransaction(xdr: string) {
  const { result } = await kit.signTransaction({
    xdr,
    network: WalletNetwork.TESTNET,
  });
  return result;
}
