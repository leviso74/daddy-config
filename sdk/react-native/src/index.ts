export { Daddy-configRNClient } from './client.js';
export type { Daddy-configRNClientOptions, Daddy-configSigner } from './client.js';
export { useCreateRemittance, useNetworkToggle } from './hooks.js';
export type { StellarNetwork } from './hooks.js';

// Re-export core SDK utilities so consumers only need one import
export {
  toStroops,
  fromStroops,
  USDC_MULTIPLIER,
  Networks,
  RpcUrls,
  ErrorCode,
  Daddy-configError,
  parseContractError,
} from '@daddy-config/sdk';
