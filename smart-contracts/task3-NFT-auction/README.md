# Address on Sepolia:

- Antony auction proxyAddress:  0x0369DF4492f431B7B9e835075f9b53022C477e2A
- Auction factory address:      0x35Bfb8C319c968d8De76B989a17b70a994e1164d
- auctionImplementation in factory:  0xD9Ac4219AF3bBD6d684B1dd903F5c61815f7F4F3
# Init project:
```
1. git clone git@github.com:AntonyC/Dapp.git
2. cd ~/Dapp/smart-contracts/task3-NFT-auction
3. pnpm install
4. Creact file .env under path ~/Dapp/smart-contracts/task3-NFT-auction
5. Add properties of INFURA_API_KEY and PK(private key) to .env file
```
# Deploy steps to Sepolia:

```shell
1. npx hardhat node
2. npx hardhat deploy --tags DeployAntonyAuction --network sepolia
3. npx hardhat deploy --tags UpgradeAntonyAuction --network sepolia
4. npx hardhat deploy --tags DeployAuctionFactory --network sepolia
```
# Test steps on local:

```
1. cd ~/Dapp/smart-contracts/task3-NFT-auction
2. npx hardhat test
```

# Reference websites

[buy usdc](https://app.uniswap.org/)

[price feeds address](https://docs.chain.link/data-feeds/price-feeds/addresses?page=1&testnetPage=1#sepolia-testnet)

[Remixd: Access your Local Filesystem](https://remix-ide.readthedocs.io/en/latest/remixd.html)
