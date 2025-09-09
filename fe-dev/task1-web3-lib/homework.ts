import { ethers } from "ethers";
import { abiAntonyC } from "./utils-sepolia";

// Create wallet
const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet?.mnemonic?.phrase,
  };
};

// Connect MetaMask
const connectMetaMask = async () => {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

const transferERC20 = async (
  contractAddress: string,
  to: string,
  amount: string
) => {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abiAntonyC, signer);

  const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
  return tx.wait();
};

const monitorTransfers = (contractAddress: string) => {
  const provider = ethers.getDefaultProvider("mainnet");
  const contract = new ethers.Contract(contractAddress, abiAntonyC, provider);

  contract.on("Transfer", (from, to, value, event) => {
    console.log(`Transfer: ${value} from ${from} to ${to}`);
  });
};

const UNISWAP_ROUTER_ABI = [];
const swapTokens = async (
  routerAddress: string,
  path: string[],
  amountIn: string
) => {
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();

  const router = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, signer);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minites
  const tx = await router.swapExactTokensForTokens(
    ethers.parseUnits(amountIn, 18),

    path,
    signer.address,
    deadline
  );

  return tx.wait();
};

console.log("--1. createWallet: ", createWallet());
