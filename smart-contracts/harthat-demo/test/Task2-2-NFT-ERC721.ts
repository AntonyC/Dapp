import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SimpleNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const simpleNFT = await hre.viem.deployContract("SimpleNFT");

    const publicClient = await hre.viem.getPublicClient();

    return {
      simpleNFT,
      publicClient
    };
  }

  describe("Deployment", function () {
    it("Should set the right symbol", async function () {
      const { simpleNFT } = await loadFixture(deployOneYearLockFixture);
      expect(await simpleNFT.read.symbol()).to.equal("Antony'sNFT");
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.read.owner()).to.equal(
    //     getAddress(owner.account.address)
    //   );
    // });
  });
});
