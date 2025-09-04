// Hierarchical Deterministic Wallet

// BIP32: m/0/0/1. Multiple private keys can be derived from a single random seed.
// BIP39: Users can keep their private keys in a human-readable mnemonic phrase, instead of a long hexadecimal string.
// BIP44: m / purpose' / coin_type' / account' / change / address_index
//        m: Fixed as "m"
//           purpose：Fixed as "44"
//                      coin_type：0 for Bitcoin mainnet, 1 for Bitcoin testnet, 60 for Ethereum mainnet
//                                  account：account index, starting from 0
//                                               change：0 for external, 1 for internal (usually set to 0)
//                                                       address_index：starting from 0; to generate new addresses, increment this to 1, 2, 3, etc.

import { ethers, HDNodeWallet } from "ethers";

async function main() {
  // 1. Create HD wallet
  console.group("\n1. Create HD wallet");
  // Create random mnemonic
  const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));
  console.log("Random mnemonic: ", mnemonic);
  // Create HD base wallet "m / purpose' / coin_type' / account' / change"
  const basePath = "44'/60'/0'/0";
  const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);
  console.log(baseWallet);
  console.groupEnd();

  // 2. Derive 20 wallets by an HD wallet
  console.group("\n2. Derive 20 wallets by an HD wallet");
  const numWallet = 20;
  let wallets: HDNodeWallet[] = [];
  for (let i = 0; i < numWallet; i++) {
    let baseWalletNew = baseWallet.derivePath(i.toString());
    console.log(`Wallet address #${i + 1}: `, baseWalletNew.address);
    wallets.push(baseWalletNew);
  }
  console.groupEnd();

  // 3. Save the wallet (encrypted JSON)
  console.group("\n3. Save the wallet (encrypted JSON)");
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  console.log(wallet);
  const pwd = "PASSWARD";
  const json = await wallet.encrypt(pwd);
  console.log(json);
  console.groupEnd();

  // 4. Read the wallet from the encrypted JSON
  const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
  console.group("\n4. Read the wallet from the encrypted JSON: ");
  console.log(wallet2);
  console.groupEnd();
}

main();

// 1. Create HD wallet
//   Random mnemonic:  embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor
//   HDNodeWallet {
//     provider: null,
//     address: '0x0348eB96F97a25cbddc621645617d73d53218c1E',
//     publicKey: '0x0324760c37779aef90f6973271f1f65f8f0f864fb78e4b3852e398cd3a521d5639',
//     fingerprint: '0x14ec016b',
//     parentFingerprint: '0x40b23359',
//     mnemonic: Mnemonic {
//       phrase: 'embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor',
//       password: "44'/60'/0'/0",
//       wordlist: LangEn { locale: 'en' },
//       entropy: '0x48749f841cafb5647baed4dd8d94be22b1d74c0401bfd141f388199f5acbd95b'
//     },
//     chainCode: '0x6f35591ab6366b05d9256fc4060317aee9a74776696bc2397199feb6cc73bc46',
//     path: "m/44'/60'/0'/0/0",
//     index: 0,
//     depth: 5
//   }

// 2. Derive 20 wallets by an HD wallet
//   Wallet address #1:  0xD79c871406A5ba62702457D24c9410d264E51718
//   Wallet address #2:  0xCe3C1b5bfBFFf7ffeac7f579949E2F73611771fc
//   Wallet address #3:  0xE49C784D40Dbc73d3B274F9022B33319589927F7
//   Wallet address #4:  0x62f2216CB48DB0d43EC7b401F9A51867124d703C
//   Wallet address #5:  0x439C5669eBd4766D0C1c669BDC1E32E3b4c5e39A
//   Wallet address #6:  0xF3e1eb8CE9620EF11595934957E13C481c63eFC0
//   Wallet address #7:  0xDC734c354845b548e7e329523DD653141a524242
//   Wallet address #8:  0xb2dA411Ccd02588a69B9Ac08AD036bD00FA368F2
//   Wallet address #9:  0x1d0B0C030D631ECf27c780E8489DF921920C320F
//   Wallet address #10:  0x7D03A670a2d245038E900D80132077FB8C5AaBe1
//   Wallet address #11:  0x24802C1F8Ff57688B59eB7D2f584A24E86c95A59
//   Wallet address #12:  0xB524862485ae9356c009769D1DBC1D2D79EB0711
//   Wallet address #13:  0x9e8fcb372760Ad6FEDC56435E416859d75D02000
//   Wallet address #14:  0x0A8721E579f2042287363067002fdA14F7f55b4d
//   Wallet address #15:  0x4E5710ACe35F023F24949047899E0268CCD472eE
//   Wallet address #16:  0x4686c2F5c4F99F0e67762eFDD9FD87B5109d6de1
//   Wallet address #17:  0xf768C44b5c0f3671117b89F2B0CBaD1112a9a9Db
//   Wallet address #18:  0x7D0424C3b1CA3a708BDb5B64EFf571Ed6B9d6d51
//   Wallet address #19:  0xF535716ebc47b87f1DdDD8A9e6e6a8Df17716C5D
//   Wallet address #20:  0x1AC2d96B332493e296d9F64e955a5eF050D01bE7

// 3. Save the wallet (encrypted JSON)
//   HDNodeWallet {
//     provider: null,
//     address: '0xbc6f8Aca1771E77383A5fa827C359bE39Cd476ad',
//     publicKey: '0x03cd61b9242b5d7df54669cbb816052b9b549db41c36bae40f879f8196e9577704',
//     fingerprint: '0x7ba04d17',
//     parentFingerprint: '0x6ad4dd2a',
//     mnemonic: Mnemonic {
//       phrase: 'embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor',
//       password: '',
//       wordlist: LangEn { locale: 'en' },
//       entropy: '0x48749f841cafb5647baed4dd8d94be22b1d74c0401bfd141f388199f5acbd95b'
//     },
//     chainCode: '0x32204d7d46b95559a2b143426613cbff498b616bf1a8b01489378a27e749bc7a',
//     path: "m/44'/60'/0'/0/0",
//     index: 0,
//     depth: 5
//   }
//   {"address":"bc6f8aca1771e77383a5fa827c359be39cd476ad","id":"24dabc08-28dc-4e70-90b7-72dcf8faa99a","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"010179ad2d7ad08fa1db39a51b7c9d9c"},"ciphertext":"12337eeab43c4f42ed655b902cdd7156d74a3a34a15413acbdb812636bb2f2fc","kdf":"scrypt","kdfparams":{"salt":"2e1b86e7c6a3b3b8933583fd8eb4890eec9f5bba1024ebec247b831ea6992efa","n":131072,"dklen":32,"p":1,"r":8},"mac":"6a33e5ec5594265cf30088f2ab41e84b360d9e58c9e9e490e9ab350c905147ee"},"x-ethers":{"client":"ethers/6.15.0","gethFilename":"UTC--2025-09-04T15-16-12.0Z--bc6f8aca1771e77383a5fa827c359be39cd476ad","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"11313e8893ef43b0458fada2294ead66","mnemonicCiphertext":"3a91026046e45a07255726e63bb0cd2a5ffd0f56c4cf7c800e7baab806034f88","version":"0.1"}}

// 4. Read the wallet from the encrypted JSON:
//   HDNodeWallet {
//     provider: null,
//     address: '0xbc6f8Aca1771E77383A5fa827C359bE39Cd476ad',
//     publicKey: '0x03cd61b9242b5d7df54669cbb816052b9b549db41c36bae40f879f8196e9577704',
//     fingerprint: '0x7ba04d17',
//     parentFingerprint: '0x6ad4dd2a',
//     mnemonic: Mnemonic {
//       phrase: 'embody pilot three deer win rate upgrade surround talk hole convince earth buddy plastic avoid dawn spend auto tilt creek volcano grass grace labor',
//       password: '',
//       wordlist: LangEn { locale: 'en' },
//       entropy: '0x48749f841cafb5647baed4dd8d94be22b1d74c0401bfd141f388199f5acbd95b'
//     },
//     chainCode: '0x32204d7d46b95559a2b143426613cbff498b616bf1a8b01489378a27e749bc7a',
//     path: "m/44'/60'/0'/0/0",
//     index: 0,
//     depth: 5
//   }
