# Web3 开发学习任务
## 🎯 学习目标
1. 掌握以太坊 JSON-RPC 规范
2. 熟练使用 ethers.js 核心功能
3. 实现完整 DApp 开发流程
4. 理解智能合约交互原理
## 📚 基础学习模块
```bash
# 1. 环境搭建
npm install ethers hardhat @nomiclabs/hardhat-waffle
 ```


### 实战任务 1：连接钱包
```typescript
import { ethers } from 'ethers'

// 创建钱包实例
const createWallet = () => {
  const wallet = ethers.Wallet.createRandom()
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  }
}

// 连接 MetaMask
const connectMetaMask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  return provider.getSigner()
}
 ```
## 🔥 核心实战任务
### 任务 2：代币转账
```typescript
const transferERC20 = async (
  contractAddress: string,
  to: string,
  amount: string
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    signer
  )
  
  const tx = await contract.transfer(to, ethers.utils.parseUnits(amount, 18))
  return tx.wait()
}
 ```
### 任务 3：监听链上事件
```typescript
const monitorTransfers = (contractAddress: string) => {
  const provider = ethers.getDefaultProvider('mainnet')
  const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
  
  contract.on('Transfer', (from, to, value, event) => {
    console.log(`Transfer: ${value} from ${from} to ${to}`)
  })
}
 ```
## 🛠️ 综合项目
去中心化交易所（DEX）功能需求

```typescript
const swapTokens = async (
  routerAddress: string,
  path: string[],
  amountIn: string
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  
  const router = new ethers.Contract(
    routerAddress,
    UNISWAP_ROUTER_ABI,
    signer
  )

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20分钟有效期
  const tx = await router.swapExactTokensForTokens(
    ethers.utils.parseUnits(amountIn, 18),
    0, // 最小输出量
    path,
    await signer.getAddress(),
    deadline
  )

  return tx.wait()
}
 ```
## 📊 学习路线图
```mermaid
graph TD
    A[环境搭建] --> B[钱包交互]
    B --> C[合约开发]
    C --> D[事件监听]
    D --> E[DeFi协议集成]
    E --> F[安全审计]
 ```

## 💡 扩展内容
1. 智能合约开发 ：使用 Hardhat 编写测试用例
```typescript
describe("ERC20 Token", function () {
  it("Should deploy with initial supply", async function () {
    const Token = await ethers.getContractFactory("MyToken")
    const token = await Token.deploy(ethers.utils.parseUnits("1000000", 18))
    
    const totalSupply = await token.totalSupply()
    expect(totalSupply).to.equal(ethers.utils.parseUnits("1000000", 18))
  })
})
 ```


2. NFT 功能开发
```solidity
// ERC721 合约示例
contract MyNFT is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {
        _mint(msg.sender, 1);
    }
}
 ```
