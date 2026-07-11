/**
 * Daddy-configRNClient — React Native wrapper around the core TypeScript SDK.
 *
 * Differences from the Node SDK:
 * - Accepts a `Daddy-configSigner` instead of a raw `Keypair` so wallet
 *   implementations (expo-secure-store, WalletConnect, hardware wallets)
 *   can be swapped without changing call sites.
 * - `submitSigned` handles the sign → submit flow using the injected signer.
 * - All read-only query methods are re-exported unchanged from the core SDK.
 */

import { TransactionBuilder } from '@stellar/stellar-sdk';
import { Daddy-configClient } from '@daddy-config/sdk';
import type { Daddy-configClientOptions } from '@daddy-config/sdk';
import type { Daddy-configSigner } from './signer.js';

export type { Daddy-configSigner };

export interface Daddy-configRNClientOptions extends Daddy-configClientOptions {
  /** Wallet signer implementation. */
  signer: Daddy-configSigner;
}

export class Daddy-configRNClient extends Daddy-configClient {
  private readonly signer: Daddy-configSigner;
  private readonly _networkPassphrase: string;

  constructor(options: Daddy-configRNClientOptions) {
    super(options);
    this.signer = options.signer;
    this._networkPassphrase = options.networkPassphrase;
  }

  /**
   * Return the public key from the injected signer.
   * Use this as the `sourceAddress` for all query methods.
   */
  async getAddress(): Promise<string> {
    return this.signer.getPublicKey();
  }

  /**
   * Sign a prepared transaction using the injected signer and submit it.
   *
   * @param tx - A prepared `Transaction` returned by any write method.
   * @returns The transaction result from the RPC node.
   */
  async submitSigned(tx: import('@stellar/stellar-sdk').Transaction) {
    const xdr = tx.toXDR();
    const signedXdr = await this.signer.signTransaction(xdr, {
      networkPassphrase: this._networkPassphrase,
    });
    const signedTx = TransactionBuilder.fromXDR(signedXdr, this._networkPassphrase);
    // Cast: fromXDR returns FeeBumpTransaction | Transaction; we know it's Transaction here
    return this.submitTransaction(
      signedTx as import('@stellar/stellar-sdk').Transaction,
      // submitTransaction expects a Keypair but we've already signed — pass a no-op shim
      { sign: () => {} } as any
    );
  }
}
