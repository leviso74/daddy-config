#!/bin/bash

# Daddy-config Setup Script
# This script installs all prerequisites and builds the contract

set -e

echo "🚀 Daddy-config Setup Script"
echo "=========================="
echo ""

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed"
    echo "📦 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo "✅ Rust installed successfully"
else
    echo "✅ Rust is already installed ($(rustc --version))"
fi

# Add wasm32 target
echo ""
echo "📦 Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown
echo "✅ wasm32 target added"

# Check if Soroban CLI is installed
echo ""
if ! command -v soroban &> /dev/null; then
    echo "📦 Installing Soroban CLI..."
    cargo install --locked soroban-cli --features opt
    echo "✅ Soroban CLI installed successfully"
else
    echo "✅ Soroban CLI is already installed ($(soroban --version))"
fi

# Configure testnet
echo ""
echo "🌐 Configuring Stellar testnet..."
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" 2>/dev/null || echo "Testnet already configured"
echo "✅ Testnet configured"

# Build the contract
echo ""
echo "🔨 Building contract..."
cargo build --target wasm32-unknown-unknown --release

# Optimize the contract
echo ""
echo "⚡ Optimizing contract..."
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/daddy-config.wasm

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run tests: cargo test"
echo "2. Deploy to testnet: See DEPLOYMENT.md for instructions"
echo ""
