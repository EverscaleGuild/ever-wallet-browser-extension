# TON Crystal Wallet
TON Wallet browser extension. Manage Free TON wallets and access dApps directly from your Chrome browser.

## How to build

```bash
# Prepare builder container
docker build --tag ton-crystal-extension .

# Build extension
docker run -ti --rm --mount type=bind,source=$(pwd),target=/app ton-crystal-extension

# Extension output will be at $(pwd)/dist 
```

## Dev build requirements

- Rust 1.50+ with installed target `wasm32-unknown-unknown`
- wasm-pack
- binaryen 99+ (for `wasm-opt`)
- Node.js 14+

## Changelog

### 0.1.3 (2021-05-14)

Features:
* Add `Notify receiver` checkbox for token transfer.

Bugfixes:
* Fixed password input for duplicated words.
* Hide `Send` button for empty WalletV3.
* Fix public key label in account card.

### 0.1.2 (2021-05-14)

Bugfixes:
* Fixed wasm-bindgen module resolution.
* Fixed outdated wasm-pack.
* Fixed memory leaks due to invalid allocator.

### 0.1.1 (2021-05-13)

Bugfixes:
* Fixed early exit from web3 subscription in case of error.

### 0.1.0 (2021-05-12)

Initial release
* Single account.
* TON wallet support.
* TIP-3 tokens support ([Broxus TIP3v3.1](https://github.com/broxus/ton-eth-bridge-token-contracts/releases/tag/3.1))
* Web3-like interface ([ton-inpage-provider](https://github.com/broxus/ton-inpage-provider))
