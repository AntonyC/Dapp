// const transferEvents = await contract.queryFilter("eventName", [startHight, endHight])
// Two types of logs:
//     topic: the event hash and the indexed variable are stored in topics
//            https://sepolia.etherscan.io/tx/0xce2f24c3be4a73b4853ce408e554fcaa6ec3eac54b99e44f33f1fe4753dfa5f0#eventlog
//     data : cannot be directly retrieved, but it can store more complex data structures

import { ethers } from "ethers";
import { provider, addrAntonyC, abiAntonyC } from "./utils-sepolia.ts";

const conAntonyC = new ethers.Contract(addrAntonyC, abiAntonyC, provider);

async function main() {
  const transferEvents = await conAntonyC.queryFilter("Transfer");
  console.log("--: ", transferEvents.length);

  //   // 获取过去10个区块内的Transfer事件
  //   console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
  //   // 得到当前block
  //   const block = await provider.getBlockNumber();
  //   console.log(`当前区块高度: ${block}`);
  //   console.log(`打印事件详情:`);
  //   const transferEvents = await conAntonyC.queryFilter(
  //     "Transfer",
  //     block - 10,
  //     block
  //   );
  //   // 打印第1个Transfer事件
  //   console.log(transferEvents[0]);
  //   console.log("--: ", transferEvents.length);
}

main();

// [
//   EventLog {
//     provider: JsonRpcProvider {},
//     transactionHash: '0x5100fcbd301048e0e83389d7eb7444fe720a79521e09572a9bfaba5fd434b11e',
//     blockHash: '0xc2cec2c2a0d190c9f90c37c73ddc4165b7f23ed520a88b1dde8c983aa1fa499a',
//     blockNumber: 9101392,
//     removed: false,
//     address: '0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F',
//     data: '0x0000000000000000000000000000000000000000000000008ac7230489e80000',
//     topics: [
//       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//       '0x0000000000000000000000000000000000000000000000000000000000000000',
//       '0x000000000000000000000000f1c88c36fb612cf5d9c3f84f651bfe9049b1b927'
//     ],
//     index: 34,
//     transactionIndex: 15,
//     interface: Interface {
//       fragments: [Array],
//       deploy: [ConstructorFragment],
//       fallback: null,
//       receive: false
//     },
//     fragment: EventFragment {
//       type: 'event',
//       inputs: [Array],
//       name: 'Transfer',
//       anonymous: false
//     },
//     args: Result(3) [
//       '0x0000000000000000000000000000000000000000',
//       '0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927',
//       10000000000000000000n
//     ]
//   },
//   EventLog {
//     provider: JsonRpcProvider {},
//     transactionHash: '0xce2f24c3be4a73b4853ce408e554fcaa6ec3eac54b99e44f33f1fe4753dfa5f0',
//     blockHash: '0x1c48eb0f3845b9cdc403030e2e7a85cb223e14f592534617f8d502b6a3fea090',
//     blockNumber: 9111586,
//     removed: false,
//     address: '0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F',
//     data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
//     topics: [
//       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//       '0x000000000000000000000000f1c88c36fb612cf5d9c3f84f651bfe9049b1b927',
//       '0x0000000000000000000000001329f875b2af89dc6e1438bb8d232188f9474ba1'
//     ],
//     index: 8,
//     transactionIndex: 9,
//     interface: Interface {
//       fragments: [Array],
//       deploy: [ConstructorFragment],
//       fallback: null,
//       receive: false
//     },
//     fragment: EventFragment {
//       type: 'event',
//       inputs: [Array],
//       name: 'Transfer',
//       anonymous: false
//     },
//     args: Result(3) [
//       '0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927',
//       '0x1329f875B2AF89dC6e1438bb8d232188F9474BA1',
//       1000000000000000000n
//     ]
//   }
// ]
