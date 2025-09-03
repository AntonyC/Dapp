import { ethers } from "ethers";
// 1. BigNumber
console.group("\n1. BigNumber");

const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
console.log("From int", ethers.getBigInt("1000000000"));
console.log("From hex: ", ethers.getBigInt("0x3b9aca00"));
console.log("From number: ", ethers.getBigInt(1000000000));
console.log("Maximum safe integer in JS: ", Number.MAX_SAFE_INTEGER);
try {
  // A BigNumber cannot be generated from a number beyond the maximum safe integer in JavaScript.
  ethers.getBigInt(Number.MAX_SAFE_INTEGER + 1);
} catch (e) {
  console.log("From greater then max: ", e.message);
}
console.groupEnd();

// 2. Formatting: Small Units to Large Units
console.group("\n2. Formatting: Small Units to Larger Units");
console.log(ethers.formatUnits(oneGwei, 0)); // '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei")); // '1.0'
console.log(ethers.formatUnits(oneGwei, 9)); // '1.0'
console.log(ethers.formatUnits(oneGwei, "ether")); // `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei")); // '1.0'
console.log(ethers.formatEther(oneGwei)); // `0.000000001` same with formatUnits(value, "ether")
console.groupEnd();

// 3. Parsing：Large Units to Small Units
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
console.group("\n3. Parsing: Large Units to Small Units");
console.log(ethers.parseUnits("1.0").toString()); // { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "ether").toString()); // { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", 18).toString()); // { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "gwei").toString()); // { BigNumber: "1000000000" }
console.log(ethers.parseUnits("1.0", 9).toString()); // { BigNumber: "1000000000" }
console.log(ethers.parseEther("1.0").toString()); // { BigNumber: "1000000000000000000" } same with parseUnits(value, "ether")
console.groupEnd();

// const names = [
//     "wei",
//     "kwei",
//     "mwei",
//     "gwei",
//     "szabo",
//     "finney",
//     "ether",
// ];
