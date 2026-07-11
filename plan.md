# Daddy-config — Wave Program Contribution Plan

## Project Overview

Daddy-config is a production-ready Soroban smart contract powering a USDC remittance platform on the Stellar blockchain. The system includes an escrow-based contract (Rust/Soroban), a REST API (TypeScript), a backend event processor, a React frontend, a React Native mobile app, and a TypeScript SDK.

Contributors work across the full stack — from low-level contract logic to UI and tooling.

---

## How the Wave Program Works

Maintainers create scoped, self-contained issues that contributors pick up during sprint cycles. Each issue is tagged with a type, difficulty, and affected layer so contributors can find work that matches their skills. Issues are opened at the start of each sprint and claimed on a first-come, first-served basis. A contributor signals intent by commenting on the issue before opening a PR.

---

## Types of Work Posted

### 1. Bug Fixes
Targeted, well-scoped issues with a clear reproduction path and acceptance criteria.

Examples:
- Fix incorrect fee accumulation when `confirm_partial_payout` is called multiple times
- Resolve edge case in `process_expired_remittances` where a batch exceeding 50 IDs panics instead of returning an error
- Correct API response shape mismatch between `openapi.yaml` spec and actual route handler output
- Fix race condition in the backend scheduler when polling KYC status concurrently

Labels: `bug`, `good first issue` (for isolated fixes), `contract`, `api`, `backend`

---

### 2. New Features
Larger, well-defined issues with a design note attached. Contributors are expected to write tests alongside the implementation.

Examples:
- Implement `raise_dispute` and `resolve_dispute` contract functions per the state machine spec
- Add multi-currency support to `create_remittance` using a token whitelist check
- Extend the SDK with a `subscribeToRemittance(id, callback)` event listener
- Build the agent reputation scoring endpoint in the API (`GET /agents/:id/reputation`)
- Add batch remittance creation support (`create_batch_remittance`) to the contract

Labels: `feature`, `contract`, `sdk`, `api`, `frontend`

---

### 3. Documentation
Issues for contributors who want to improve developer experience without writing production code.

Examples:
- Write a `CONTRIBUTING.md` guide covering local setup, test commands, and PR expectations
- Document all contract error codes with causes and resolution steps in a dedicated `ERRORS.md`
- Add inline `///` doc comments to all public contract functions in `lib.rs`
- Create a corridor configuration guide explaining `set_daily_limit` usage by currency and country
- Write a webhook integration guide for third-party developers

Labels: `documentation`, `good first issue`

---

### 4. Testing
Issues focused on coverage gaps, property-based tests, and integration test scenarios.

Examples:
- Add property-based tests for the `fee_service` covering all corridor configurations
- Write integration tests for the full remittance lifecycle (create → process → complete) against a testnet deployment
- Add load test scenarios in `tests/load/` for concurrent `create_remittance` calls
- Increase contract fuzz coverage for `validate_amount` and `validate_corridor` inputs
- Write end-to-end tests for the dispute resolution flow using the frontend + contract

Labels: `testing`, `contract`, `backend`, `frontend`

---

### 5. Tooling & DevEx
Issues that improve the development workflow, CI pipeline, or local environment.

Examples:
- Add a `validate-env-examples.js` check to the pre-commit hook
- Extend the `Makefile` with a `make test-all` target that runs contract, API, and backend tests in sequence
- Improve the staging smoke test script to cover the remittance creation endpoint
- Add a GitHub Actions job that publishes the ABI on every release tag
- Set up automated dependency audits via `cargo audit` and `npm audit` in CI

Labels: `tooling`, `ci`, `devex`, `good first issue`

---

## Contribution Standards

All issues will include:
- **Scope** — which files or modules are affected
- **Acceptance criteria** — a checklist that must pass before review
- **Difficulty** — `starter`, `intermediate`, or `advanced`
- **Layer** — `contract`, `api`, `backend`, `frontend`, `sdk`, `mobile`, `tooling`

Contributors are expected to run `cargo test` for contract changes and the relevant `npm test` for service changes before opening a PR. PRs without passing tests will not be reviewed.

---

## Sprint Cadence

Sprints run on a two-week cycle. Issues are opened at the start of each sprint. Unclaimed issues roll over. Contributors may propose new issues by opening a discussion thread with the `proposal` label.
