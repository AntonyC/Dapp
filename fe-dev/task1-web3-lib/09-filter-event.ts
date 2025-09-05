// An event filter can contain up to 4 topic sets
//     each of which is a condition used to filter the target events.

// const filter = contract.filters.EVENT_NAME( ...args )

import { ethers } from "ethers";
import {
  provider,
  addrAntonyC,
  abiAntonyC,
  addrAccount,
} from "./utils-sepolia.ts";

const wallet = new ethers.Wallet(process.env.PK || "", provider);
const conAntonyC = new ethers.Contract(addrAntonyC, abiAntonyC, wallet);

async function main() {
  console.log(
    "--Balance: ",
    ethers.formatUnits(await conAntonyC.balanceOf(addrAccount), "ether")
  );
  // filter by "to address"
  let filterBinanceIn = conAntonyC.filters.Transfer(null, addrAccount);
  console.log("--filterBinanceIn", filterBinanceIn);

  conAntonyC.once(filterBinanceIn, async (res) => {
    console.log("---------Start listen BinanceIn--------");
    console.log(
      `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(
        res.args[2],
        "ether"
      )}`
    );
    console.log(
      "--Balance: ",
      ethers.formatUnits(await conAntonyC.balanceOf(addrAccount), "ether")
    );
  });
  // filter by "from address"
  let filterToBinanceOut = conAntonyC.filters.Transfer(addrAccount);
  console.log("--filterToBinanceOut: ", filterToBinanceOut);
  conAntonyC.once(filterToBinanceOut, async (res) => {
    console.log("---------Start listen BinanceOut--------");
    console.log(
      `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(
        res.args[2],
        "ether"
      )}`
    );
    console.log(
      "--Balance: ",
      ethers.formatUnits(await conAntonyC.balanceOf(addrAccount), "ether")
    );
  });
}
main();

// --Balance:  7.8
// ---------Start listen BinanceOut--------
// 0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 -> 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 0.1
// --Balance:  7.7
// ---------Start listen BinanceIn--------
// 0x1329f875B2AF89dC6e1438bb8d232188F9474BA1 -> 0xf1C88C36Fb612Cf5D9c3f84F651bFE9049b1B927 0.2
// --Balance:  7.9

// --filterToBinanceOut:  PreparedTopicFilter {
//   fragment: EventFragment {
//     type: 'event',
//     inputs: [ [ParamType], [ParamType], [ParamType] ],
//     name: 'Transfer',
//     anonymous: false
//   }
// }
