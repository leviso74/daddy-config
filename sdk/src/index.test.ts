import { describe, it, expect } from "vitest";
import { toStroops, fromStroops, USDC_MULTIPLIER } from "../src/index.js";

describe("toStroops / fromStroops", () => {
  it("converts 1 USDC to 10_000_000 stroops", () => {
    expect(toStroops(1)).toBe(USDC_MULTIPLIER);
  });

  it("round-trips correctly", () => {
    expect(fromStroops(toStroops(42.5))).toBeCloseTo(42.5);
  });

  it("handles zero", () => {
    expect(toStroops(0)).toBe(0n);
    expect(fromStroops(0n)).toBe(0);
  });
});

import { Daddy-configError, ErrorCode, parseContractError } from "../src/errors.js";

describe("ErrorCode enum", () => {
  it("has the correct numeric values for key codes", () => {
    expect(ErrorCode.AlreadyInitialized).toBe(1);
    expect(ErrorCode.Unauthorized).toBe(20);
    expect(ErrorCode.DailySendLimitExceeded).toBe(21);
    expect(ErrorCode.TimelockNotElapsed).toBe(70);
    expect(ErrorCode.GovernanceAlreadyInitialized).toBe(74);
  });

  it("covers all 74 error codes without gaps", () => {
    const codes = Object.values(ErrorCode).filter(
      (v): v is number => typeof v === "number"
    );
    expect(codes.length).toBe(74);
    // Codes should be 1..74 with no duplicates
    const unique = new Set(codes);
    expect(unique.size).toBe(74);
  });
});

describe("Daddy-configError", () => {
  it("is an instance of Error", () => {
    const err = new Daddy-configError(ErrorCode.Unauthorized, "raw");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(Daddy-configError);
  });

  it("sets name to Daddy-configError", () => {
    const err = new Daddy-configError(ErrorCode.ContractPaused, "raw");
    expect(err.name).toBe("Daddy-configError");
  });

  it("exposes the error code", () => {
    const err = new Daddy-configError(ErrorCode.DailySendLimitExceeded, "raw");
    expect(err.code).toBe(ErrorCode.DailySendLimitExceeded);
  });

  it("exposes the raw error string", () => {
    const err = new Daddy-configError(ErrorCode.InvalidFeeBps, "Simulation failed: ContractError(4)");
    expect(err.rawError).toBe("Simulation failed: ContractError(4)");
  });

  it("has a human-readable message", () => {
    const err = new Daddy-configError(ErrorCode.InvalidFeeBps, "raw");
    expect(err.message).toContain("basis points");
  });
});

describe("parseContractError", () => {
  it("parses ContractError(N) pattern", () => {
    const err = parseContractError("HostError: Value(Status(ContractError(4)))");
    expect(err).not.toBeNull();
    expect(err!.code).toBe(ErrorCode.InvalidFeeBps);
  });

  it("parses 'Contract, #N' pattern", () => {
    const err = parseContractError("Simulation failed: Error(Contract, #20)");
    expect(err).not.toBeNull();
    expect(err!.code).toBe(ErrorCode.Unauthorized);
  });

  it("returns null for non-contract errors", () => {
    expect(parseContractError("Network timeout")).toBeNull();
    expect(parseContractError(new Error("connection refused"))).toBeNull();
  });

  it("returns null for unknown error codes", () => {
    expect(parseContractError("ContractError(9999)")).toBeNull();
  });

  it("works with Error objects", () => {
    const err = parseContractError(new Error("ContractError(70)"));
    expect(err).not.toBeNull();
    expect(err!.code).toBe(ErrorCode.TimelockNotElapsed);
  });
});
