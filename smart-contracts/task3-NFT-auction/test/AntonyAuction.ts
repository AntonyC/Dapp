import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect, use } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("AntonyAuction", function () {
  async function deployOneYearLockFixture() {
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
      const { antonyAuction, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await antonyAuction.read.admin()).to.equal(getAddress(owner.account.address));
    });
  });
});
