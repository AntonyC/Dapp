// Method to listen contract：
// 1. listen once
// contract.once("event_name", Listener)
// 2. listen continuously
// contract.on("event_name", Listener)
// contract.off("event_name", Listener)

import { ethers } from "ethers";
import { provider, addrAntonyC, abiAntonyC } from "../utils-sepolia.ts";

const conAntonyC = new ethers.Contract(addrAntonyC, abiAntonyC, provider);

const main = async () => {
  try {
    // 1. listen once
    conAntonyC.once("Transfer", (from, to, value) => {
      console.log(
        "once: ",
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value), 6)}`
      );
    });

    // 2. listen continuously
    conAntonyC.on("Transfer", handleTransfer);
  } catch (e) {
    console.log("--", e);
  }
};

let count = 0;
function handleTransfer(from: string, to: string, value: bigint) {
  count++;

  console.log(
    "continuous: ",
    `${from} -> ${to} ${ethers.formatUnits(value, "ether")}`
  );

  if (count >= 3) {
    // ✅ cancel listening
    conAntonyC.off("Transfer", handleTransfer);
    console.log("Stopped listening after 3 events.");
  }
}

main();

// once:  0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 -> 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 100000000000.0
// continuous:  0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 -> 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 0.1
// continuous:  0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 -> 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 0.2
// continuous:  0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 -> 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 0.3
// Stopped listening after 3 events.
