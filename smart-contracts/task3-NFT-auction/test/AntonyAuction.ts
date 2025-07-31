import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect, use } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("AntonyAuction", function () {
  async function deployAntonyAutionFixture() {
    const [owner, user1, user2] = await hre.viem.getWalletClients();
    const antonyAuction = await hre.viem.deployContract("AntonyAuction");
    const publicClient = await hre.viem.getPublicClient();

    return {
      antonyAuction,
      owner,
      user1,
      user2,
      publicClient,
    };
    
  }

  describe("Deployment", function () {
    it("Test the admin is owner", async function () {
      const { antonyAuction, owner } = await loadFixture(deployAntonyAutionFixture);
      expect(await antonyAuction.read.admin()).to.equal(getAddress(owner.account.address));
    });

    it("Create the auction", async function () {
      const { antonyAuction } = await loadFixture(deployAntonyAutionFixture);
      await antonyAuction.write.createAuction(
        [100n, 100n,getAddress("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"), 0n]
      );

      expect(await antonyAuction.read.nextAuctionId()).to.equal(1n);
    });
  });
});
