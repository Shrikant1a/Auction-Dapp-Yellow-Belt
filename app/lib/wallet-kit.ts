import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    XBULL_ID,
    FREIGHTER_ID,
    ALBEDO_ID,
} from '@creit.tech/stellar-wallets-kit';

export const kit = new StellarWalletsKit({
    network: WalletNetwork.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
});
