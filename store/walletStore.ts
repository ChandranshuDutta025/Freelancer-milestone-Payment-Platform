import { create } from 'zustand';
import {
  StellarWalletsKit,
  Networks,
  KitEventType,
  type ISupportedWallet,
} from '@creit.tech/stellar-wallets-kit';
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule, XBULL_ID } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { AlbedoModule, ALBEDO_ID } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { LobstrModule, LOBSTR_ID } from '@creit.tech/stellar-wallets-kit/modules/lobstr';
import { RabetModule, RABET_ID } from '@creit.tech/stellar-wallets-kit/modules/rabet';
import { HanaModule, HANA_ID } from '@creit.tech/stellar-wallets-kit/modules/hana';

interface WalletState {
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: string;
  balance: string;
  error: string | null;
  wallets: ISupportedWallet[];
  selectedWalletId: string | null;

  initialize: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  setBalance: (balance: string) => void;
  setError: (error: string | null) => void;
  getAddress: () => string | null;
  signTransaction: (xdr: string) => Promise<string>;
}

const WALLET_MODULES = [
  new FreighterModule(),
  new xBullModule(),
  new AlbedoModule(),
  new LobstrModule(),
  new RabetModule(),
  new HanaModule(),
];

const WALLET_ID_MAP: Record<string, string> = {
  [FREIGHTER_ID]: FREIGHTER_ID,
  [XBULL_ID]: XBULL_ID,
  [ALBEDO_ID]: ALBEDO_ID,
  [LOBSTR_ID]: LOBSTR_ID,
  [RABET_ID]: RABET_ID,
  [HANA_ID]: HANA_ID,
};

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  network: 'TESTNET',
  balance: '0',
  error: null,
  wallets: [],
  selectedWalletId: null,

  initialize: async () => {
    try {
      StellarWalletsKit.init({
        modules: WALLET_MODULES,
        network: Networks.TESTNET,
      });

      const supportedWallets = await StellarWalletsKit.refreshSupportedWallets();
      set({ wallets: supportedWallets });

      StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
        const { address } = event.payload;
        if (address) {
          set({ address, publicKey: address, isConnected: true });
        }
      });

      StellarWalletsKit.on(KitEventType.DISCONNECT, () => {
        set({
          address: null,
          publicKey: null,
          isConnected: false,
          selectedWalletId: null,
          balance: '0',
        });
      });

      const lastWalletId =
        typeof window !== 'undefined'
          ? localStorage.getItem('lastUsedWalletId')
          : null;

      if (lastWalletId && WALLET_ID_MAP[lastWalletId]) {
        try {
          StellarWalletsKit.setWallet(lastWalletId);
          const { address } = await StellarWalletsKit.getAddress();
          if (address) {
            set({
              address,
              publicKey: address,
              isConnected: true,
              selectedWalletId: lastWalletId,
            });
          }
        } catch {
          localStorage.removeItem('lastUsedWalletId');
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to initialize wallet kit';
      set({ error: message });
    }
  },

  connect: async () => {
    set({ isConnecting: true, error: null });

    try {
      const { address } = await StellarWalletsKit.authModal();
      const id = (StellarWalletsKit.selectedModule as any)?.id ?? null;
      if (id && typeof window !== 'undefined') {
        localStorage.setItem('lastUsedWalletId', id);
      }
      set({
        address,
        publicKey: address,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'User rejected wallet connection';
      set({
        error: message,
        isConnecting: false,
      });
    }
  },

  disconnect: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastUsedWalletId');
    }
    StellarWalletsKit.disconnect();
    set({
      address: null,
      publicKey: null,
      isConnected: false,
      selectedWalletId: null,
      balance: '0',
      error: null,
    });
  },

  setBalance: (balance: string) => set({ balance }),

  setError: (error: string | null) => set({ error }),

  getAddress: () => get().address,

  signTransaction: async (xdr: string) => {
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: Networks.TESTNET,
    });
    return signedTxXdr;
  },
}));
