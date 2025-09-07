import { ethers } from "ethers";

// create wallet
async function createWallet(regexList) {
  let wallet;
  let isValid = false;

  while (!isValid && regexList.length > 0) {
    wallet = ethers.Wallet.createRandom();
    const index = regexList.findIndex((regex) => regex.test(wallet.address));
    // remove regex
    if (index !== -1) {
      isValid = true;
      regexList.splice(index, 1);
    }
  }
  const data = `${wallet.address}:${wallet.privateKey}:${wallet.mnemonic.phrase}`;
  console.log(data);
  return data;
}

// create regex
function createRegex(total) {
  const regexList: RegExp[] = [];
  for (let i = 0; i < total; i++) {
    // Fill to 3 decimals, say 001，002，003，...，999
    const paddedIndex = (i + 1).toString().padStart(3, "0");
    const regex = new RegExp(`^0x${paddedIndex}.*$`);
    regexList.push(regex);
  }
  return regexList;
}

// wallet count
const total = 20;

async function main() {
  // Regex
  const regexList = createRegex(total);
  const privateKeys: string[] = [];

  for (let index = 0; index < total; index++) {
    const walletData = await createWallet(regexList);
    privateKeys.push(walletData);
  }

  console.log("--: ", privateKeys.sort().join("\n"));
}

main();

// --:  0x0017C2ADaf2563A09454b5aCe8A1bF14f85Bd49B:0x30668843e38dfe2fe4a37c6b13f8fe8cd153d6bdd5122b9bd1afca2df98c6d34
// 0x00289a78D70BdcBb7EdAF8Fc2AE92e7b25B64669:0x373020329b7f1150456782f780575cc50f0128b7d0c1f6ae6491fd7f02d2a114
// 0x00325bacEe315c1b837Ded70a76734476cEC90e0:0x1cb71371a3ac604ad9a18b57f53f775735091266e43495fa0b5e2ab77848455f
// 0x00498E5d083258d8e50a076D100acD1d3F4aAE67:0x57dd09c93d1fb2b13ff47e2bb0cf85321efb3ed1da9d6c8358ac9fe4be359944
// 0x005a3fc7A6a3980792FEe9c0eF627270e7fdfF52:0x545072bd82f36d72ace3f3d00188408f616675ba3dfd84b8bdaeef41b7e97cb7
// 0x006d7b6b7b324670814055d2E5Ae5864dBC4042a:0xca4f4f58a74c3d5713c76deea496453ac9c070c364478cd14b356d0ad64d0522
// 0x0079fd596AE0871254b3EcbDb072C66Dc4fDcae4:0xfbaf600842f92747a7adf0bb9ef04da56e116c56884d21fe509f4d5f020d12ea
// 0x0082b1fEE25e013ca6dAD665e4210C4854b2b6a7:0x685a659f9f42f421c6b37f07d95d81aedb9650b56e4d97fa3ae42ec833117efd
// 0x0098f8E164Dc9339b3E90E64188C5B6e9eB144D4:0x5ef76b375a9d221c68f3a2f1e4832b781315ce5ae58f932166458c8a5d70a93c
// 0x010d6Fd5808129F500Ea00871AfaeD50E08A5b42:0x6a799bee2f933e98797f7c11e5a451149ebacd09a05f1b6903275851f47217ec
// 0x011Dfc78E2010AE8a334BD832232398e71738086:0x42c1059f05183dc376a8495f0456e07f8af4198186431e1e0ed74c65966ec6e1
// 0x0127E474f80b822c3e52dEb9A0f4d4413ac01c89:0x6b94f8f4daef88c8a7cb7571e29b791c2eeb65483d857e8362efb477edfb6020
// 0x0135de980b0768E80A355D8C215A6d0c9D47599D:0x796cdda3b497e91c27483877b326774d203cdbc5df8ffa4012e82a8639857547
// 0x014d3a8D56d484e468004Db3fe2811c8C198342B:0xa23760d2e86ee884cb6756bf47890514e9cf36dd8482eed0ca7fe34d1b8e733a
// 0x015Dfa5778D9e76e6e88fC6a03a193813ee3D078:0x86f184dc51d389cd54b2c6e39e0b89176c0e072dc9fa3c6d4368e718118c894c
// 0x016F1113325AEc6c918EE17A39D17D90e41C1D47:0xe56109ab801cf725f50694a797b9a113285731082d5ee28eabe7e14b675e5801
// 0x017641CcD3b05705F125471B2276D3F8c1Ac5E5D:0x5aaaaa3c9a7a20c340f0e7c6efb2bb43050315582f9a6b0d820efa088d14e635
// 0x01881863c62F02C2677E6f314Ca4E478D6ecb3Ec:0x4b102eb2d9c818452df3466b59d134ddfca06617dcb5becbc65c8746092f0fb1
// 0x01983c7Bb003a822B528b28ba3887bEE1e011A72:0x6a83257a6fc2888859ee3c644040de792a40b53a710f8c3c96f112f06dd7366c
// 0x0209F88417D5dAf05143eCD51D0e921658719d38:0x6b2627b902efa142d93257bf970c44a10b7c3d1334fcd440df212d25c5775653
