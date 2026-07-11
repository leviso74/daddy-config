import { describe, it, expect } from 'vitest';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { parseRemittance } from './convert.js';
import { Daddy-configError, ErrorCode } from './errors.js';

function makeRemittanceScVal(overrides: Record<string, unknown> = {}) {
  const base = {
    id: 1,
    sender: 'GABCD1234',
    agent: 'GHIJK5678',
    amount: 1000000,
    fee: 10000,
    status: { Pending: {} },
    expiry: null,
    token: 'USDC',
    created_at: 1234567890,
    failed_at: null,
    ...overrides,
  };
  return nativeToScVal(base);
}

describe('parseRemittance', () => {
  it('parses a valid remittance ScVal into a Remittance object', () => {
    const remittance = parseRemittance(makeRemittanceScVal());

    expect(remittance.id).toBe(1n);
    expect(remittance.sender).toBe('GABCD1234');
    expect(remittance.agent).toBe('GHIJK5678');
    expect(remittance.amount).toBe(1000000n);
    expect(remittance.fee).toBe(10000n);
    expect(remittance.status).toBe('Pending');
    expect(remittance.expiry).toBeNull();
    expect(remittance.token).toBe('USDC');
    expect(remittance.createdAt).toBe(1234567890n);
    expect(remittance.failedAt).toBeNull();
  });

  it('throws a typed Daddy-configError when a required field is missing', () => {
    expect(() => parseRemittance(makeRemittanceScVal({ sender: undefined }))).toThrow(Daddy-configError);
    try {
      parseRemittance(makeRemittanceScVal({ sender: undefined }));
    } catch (error) {
      expect(error).toBeInstanceOf(Daddy-configError);
      if (error instanceof Daddy-configError) {
        expect(error.code).toBe(ErrorCode.DataCorruption);
        expect(error.rawError).toContain('sender');
      }
    }
  });

  it('throws a typed Daddy-configError when status is invalid', () => {
    expect(() => parseRemittance(makeRemittanceScVal({ status: {} }))).toThrow(Daddy-configError);
    try {
      parseRemittance(makeRemittanceScVal({ status: {} }));
    } catch (error) {
      expect(error).toBeInstanceOf(Daddy-configError);
      if (error instanceof Daddy-configError) {
        expect(error.code).toBe(ErrorCode.DataCorruption);
        expect(error.rawError).toContain('status');
      }
    }
  });
});
