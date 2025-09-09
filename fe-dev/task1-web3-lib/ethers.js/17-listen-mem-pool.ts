// MEV: Maximal Extractable Value
// Mempool: all transactions are aggregated into the Mempool (transaction memory pool)
//     before users' transactions are packaged into the Ethereum blockchain by miners.

// provider.on("pending", listener)

import { ethers } from "ethers";
import { SEPLIA_SOCKET_URL } from "../utils-sepolia.ts";

const provider = new ethers.WebSocketProvider(SEPLIA_SOCKET_URL);

console.log("\n1. Connect wss RPC");
// 1. It’s recommended to use a WSS connection instead of HTTP when listening for events.
const wallet = new ethers.Wallet(process.env.PK || "", provider);

console.log("\n2. Limit the call rate to the RPC interface");
// 2. there are so many pending transactions in the mempool—hundreds per second—it’s easy to hit the request limits of free RPC nodes
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

const main = async () => {
  let i = 0;
  // 3. Listen pending tx, print xHash
  console.log("\n3. Listen pending tx, print xHash");
  provider.once("pending", async (txHash) => {
    if (txHash && i < 20) {
      // 打印txHash
      console.log(
        `[${new Date().toLocaleTimeString()}] Pending ${i}: ${txHash} \r`
      );
      i++;
    }
  });

  // 4. Listen pending tx，get txHash and print details
  console.log("\n4. Listen pending tx, get txHash and print details");
  let j = 0;
  provider.once(
    "pending",
    throttle(async (txHash) => {
      if (txHash && j <= 20) {
        // get tx details
        let tx = await provider.getTransaction(txHash);
        console.log(
          `\n[${new Date().toLocaleTimeString()}] Pending tx ${j}: ${txHash} \r`
        );
        console.log(tx);
        j++;
      }
    }, 1000)
  );
};

main();

// 1. Connect wss RPC

// 2. Limit the call rate to the RPC interface

// 3. Listen pending tx, print xHash

// 4. Listen pending tx, get txHash and print details
// [11:20:50 PM] Pending 0: 0x5c72ea07872fc9dc7558d1c21f7b7fcffd11b67d4636bdceab7ed7d763a96a9a

// [11:20:51 PM] Pending tx 0: 0x5c72ea07872fc9dc7558d1c21f7b7fcffd11b67d4636bdceab7ed7d763a96a9a
// TransactionResponse {
//   provider: WebSocketProvider {},
//   blockNumber: null,
//   blockHash: null,
//   index: undefined,
//   hash: '0x5c72ea07872fc9dc7558d1c21f7b7fcffd11b67d4636bdceab7ed7d763a96a9a',
//   type: 2,
//   to: '0x08d2b0a37F869FF76BACB5Bab3278E26ab7067B7',
//   from: '0x16bab9ec4220EC7264D2f7Fcee92DfD68D715527',
//   nonce: 515,
//   gasLimit: 21000n,
//   gasPrice: 3037756n,
//   maxPriorityFeePerGas: 1000000n,
//   maxFeePerGas: 3037756n,
//   maxFeePerBlobGas: null,
//   data: '0x',
//   value: 451000000000000n,
//   chainId: 11155111n,
//   signature: Signature { r: "0x5d6ad2fe8f96062e876536f7722fde3611191e3374340871d65a54947396992a", s: "0x688210a0fb79ef52bb3db111955415e48b2fa14e8ab1aba9567161c0718d4075", yParity: 0, networkV: null },
//   accessList: [],
//   blobVersionedHashes: null,
//   authorizationList: null
// }
