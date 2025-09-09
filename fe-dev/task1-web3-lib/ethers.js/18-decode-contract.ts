import { ethers } from "ethers";
import { providerSocket as provider } from "../utils-sepolia.ts";

let network = provider.getNetwork();
network.then((res) =>
  console.log(`[${new Date().toLocaleTimeString()}] chain ID: ${res.chainId}`)
);

const iface = new ethers.Interface([
  "function transfer(address, uint) public returns (bool)",
]);

const selector = iface.getFunction("transfer")?.selector || "";
console.log(`Function selector: ${selector}`);

// handle bigInt
function handleBigInt(key, value) {
  if (typeof value === "bigint") {
    console.log(key, value);
    return value.toString() + "n"; // or simply return value.toString();
  }
  return value;
}

let j = 0;
const listening = async (txHash) => {
  console.log(j, txHash);
  if (!txHash) return;
  const tx = await provider.getTransaction(txHash);
  j++;
  if (tx !== null && tx.data.indexOf(selector) !== -1) {
    console.log(
      `[${new Date().toLocaleTimeString()}] ${j + 1}th pending tx: ${txHash}`
    );
    console.log("tx before: ", tx);
    console.log(
      `tx info: ${JSON.stringify(iface.parseTransaction(tx), handleBigInt, 2)}`
    );
    console.log(`To:${iface.parseTransaction(tx)?.args[0]}`);
    console.log(
      `Amount:${ethers.formatEther(iface.parseTransaction(tx)?.args[1])}`
    );
    provider.off("pending", throttledListener);
  }
};

const throttledListener = throttle(listening, 100);
provider.on("pending", throttledListener);

function throttle(fn, delay) {
  let timer;
  return function () {
    if (!timer) {
      fn.apply(this, arguments);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

// [12:56:07 PM] 24th pending tx: 0x687984a0a08792a030bc6c60f3297fad8648c7edb90a2c26b45d1e332ecabdfe
// tx before:  TransactionResponse {
//   provider: WebSocketProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x687984a0a08792a030bc6c60f3297fad8648c7edb90a2c26b45d1e332ecabdfe',
//   type: 2,
//   to: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
//   from: '0x70E3Fb28e1794bb91D5bCEB7d66b731d0C61Af8e',
//   nonce: 810052,
//   gasLimit: 85035n,
//   gasPrice: 2000232646n,
//   maxPriorityFeePerGas: 2000000000n,
//   maxFeePerGas: 2000232646n,
//   maxFeePerBlobGas: null,
//   data: '0xa9059cbb00000000000000000000000062ee31a609569404e912930d05492291dd927b9d0000000000000000000000000000000000000000000000000000000000989680',
//   value: 0n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x22276204c22c7baa4bac4f5480992f497e38f10af7db67761a24c85788194a15", s: "0x5c4c5626bd1a7654d73f5c51adc07d712f059276da26ec175d1618a2b7ceacaf", yParity: 1, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null,
//   authorizationList: null
// }
// 1 10000000n
// value 0n
// tx info: {
//   "fragment": {
//     "type": "function",
//     "inputs": [
//       {
//         "name": "",
//         "type": "address",
//         "baseType": "address",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       },
//       {
//         "name": "",
//         "type": "uint256",
//         "baseType": "uint256",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       }
//     ],
//     "name": "transfer",
//     "constant": false,
//     "outputs": [
//       {
//         "name": "",
//         "type": "bool",
//         "baseType": "bool",
//         "indexed": null,
//         "components": null,
//         "arrayLength": null,
//         "arrayChildren": null
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "payable": false,
//     "gas": null
//   },
//   "name": "transfer",
//   "args": [
//     "0x62Ee31A609569404e912930d05492291DD927B9d",
//     "10000000n"
//   ],
//   "signature": "transfer(address,uint256)",
//   "selector": "0xa9059cbb",
//   "value": "0n"
// }
// To:0x62Ee31A609569404e912930d05492291DD927B9d
// Amount:0.00000000001
