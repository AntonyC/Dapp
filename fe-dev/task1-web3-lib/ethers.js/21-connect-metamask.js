// install live server on vs code

// import { ethers } from "ethers";

const ethereumButton = document.querySelector(".connect");
const showAccount = document.querySelector(".showAccount");
const showChainID = document.querySelector(".showChainID");
const showETHBalance = document.querySelector(".showETHBalance");

// bind click event
ethereumButton.addEventListener("click", onClickHandler);

async function onClickHandler() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }

  // 1. Get provider
  const provider = new ethers.BrowserProvider(window.ethereum);

  // 2. Get authorization
  const accounts = await provider.send("eth_requestAccounts", []);
  const account = accounts[0];
  console.log(`wallet address: ${account}`);
  showAccount.textContent = account;

  // 3. Read chainId
  const { chainId } = await provider.getNetwork();
  console.log(`chainId: ${chainId}`);
  showChainID.textContent = chainId.toString();

  // 4. Read ETH balance
  const balance = await provider.getBalance(account);
  console.log(`ETH balance: ${ethers.formatEther(balance)}`);
  showETHBalance.textContent = ethers.formatEther(balance);
}
