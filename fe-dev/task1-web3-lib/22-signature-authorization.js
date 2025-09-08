// sign:   const signature = await signer.signMessage(nonce.toString());
// verify: const decodedAddress = ethers.verifyMessage(nonce.toString(), signature.toString());
// result: address.toLowerCase() === decodedAddress.toLowerCase()

// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";
const signButton = document.querySelector(".sign");
const showAccount = document.querySelector(".showAccount");
const showNonce = document.querySelector(".showNonce");
const showSignature = document.querySelector(".showSignature");
const showSignStatus = document.querySelector(".showSignStatus");

signButton.addEventListener(`click`, onClickHandler);

// Simulate user database
const users = {};
function auth(address) {
  let user = users[address];
  if (!user) {
    user = {
      address,
      nonce: Math.floor(Math.random() * 10000000),
    };
    users[address] = user;
  } else {
    user.nonce = Math.floor(Math.random() * 10000000);
    users[address] = user;
  }
  return user.nonce;
}

function verify(address, signature) {
  let signValid = false;
  console.log(`address: ${address}`);
  // Get nonce from DB
  let nonce = users[address].nonce;
  console.log(`nonce: ${nonce}`);
  // Verify the address where the nonce is signed
  const decodedAddress = ethers.verifyMessage(
    nonce.toString(),
    signature.toString()
  );
  console.log(`decodedAddress: ${decodedAddress}`);
  // Compare whether the address and the signed address are consistent
  if (address.toLowerCase() === decodedAddress.toLowerCase()) {
    signValid = true;
    // For security reasons, change the nonce to prevent logging in directly with the same nonce next time
    users[address].nonce = Math.floor(Math.random() * 10000000);
  }
  return signValid;
}

// Signature process
async function onClickHandler() {
  console.log("Connect to MetaMask");
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Get wallet account
  const accounts = await provider.send("eth_requestAccounts", []);
  const account = accounts[0];
  console.log(`Wallet account: ${account}`);
  showAccount.innerHTML = account;

  // Get data which to be signed
  const nonce = auth(account);
  showNonce.innerHTML = nonce;
  showSignature.innerHTML = "";
  showSignStatus.innerHTML = "";
  console.log(`Data to be signed: ${nonce}`);
  // Sign
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(nonce.toString());
  showSignature.innerHTML = signature;
  // Verify
  const signStatus = verify(account, signature);
  showSignStatus.innerHTML = signStatus;
}
