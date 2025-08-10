import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre, { ethers, deployments } from 'hardhat';
import { getAddress, getContract, parseGwei } from 'viem';
// import { TestERC20 } from '../typechain-types';

describe('AntonyAuction', function () {
	it('Test the admin is owner', async function () {
		const { signer, antonyAuction } = await loadFixture(deployAntonyAutionFixture);
		expect(signer.address).to.equal(await antonyAuction.admin());
	});

	it('Test auction flow', async function () {
		const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
		const unlockTime = BigInt((await time.latest()) + ONE_WEEK_IN_SECS + 10);
		const tokenId = 1;

		const { antonyAuction, testERC20, testERC721, signer, buyer1, buyer2, auctionProxy } =
			await loadFixture(deployAntonyAutionFixture);

		// 1. Create auction
		await testERC721.connect(signer).setApprovalForAll(auctionProxy.address, true);
		await antonyAuction.createAuction(
			ONE_WEEK_IN_SECS,
			ethers.parseEther('0.01'),
			await testERC721.getAddress(),
			tokenId
		);
		expect(ethers.parseEther('0.01')).to.equal((await antonyAuction.auctions(0)).startPrice);
		console.log('--Auction created successfully');

		// 2. Place bid by ETH
		let tx = await antonyAuction
			.connect(buyer1)
			.placeBid(0, 0, ethers.ZeroAddress, { value: ethers.parseEther('0.01') });
		await tx.wait();
		expect(ethers.parseEther('0.01')).to.equal((await antonyAuction.auctions(0)).highestBid);
		expect(buyer1.address).to.equal((await antonyAuction.auctions(0)).highestBidder);
		console.log('--place ETH Bid successfully');

		// 3. Place bid by USDC
		tx = await testERC20.connect(signer).transfer(buyer2, ethers.parseEther('1000'));
		await tx.wait();
		tx = await testERC20.connect(buyer2).approve(auctionProxy.address, ethers.MaxUint256);
		await tx.wait();
		tx = await antonyAuction
			.connect(buyer2)
			.placeBid(0, ethers.parseEther('101'), await testERC20.getAddress());
		await tx.wait();
		// expect(ethers.parseEther('101')).to.equal((await antonyAuction.auctions(0)).highestBid);
		expect(buyer2.address).to.equal((await antonyAuction.auctions(0)).highestBidder);
		console.log('--place USDC Bid successfully');

		// 4. End auction
		await time.increaseTo(unlockTime);
		await antonyAuction.connect(signer).endAuction(0);

		// 5. Test results
		const auctionResult = await antonyAuction.auctions(0);
		expect(auctionResult.highestBidder).to.equal(buyer2.address);
		expect(auctionResult.highestBid).to.equal(ethers.parseEther('101'));
		expect(buyer2.address).to.equal(await testERC721.ownerOf(tokenId));
	});

	async function deployAntonyAutionFixture() {
		const [signer, buyer1, buyer2] = await ethers.getSigners();

		const { auctionProxy, antonyAuction } = await getDeployedContracts();
		const testERC20 = await deployERC20();
		const testERC721 = await deployERC721();

		await setPriceFeedToAuction(antonyAuction, testERC20);

		return {
			signer,
			buyer1,
			buyer2,
			antonyAuction,
			auctionProxy,
			testERC20,
			testERC721,
		};
	}
});

async function getDeployedContracts() {
	await deployments.fixture(['DeployAntonyAuction']);

	const auctionProxy = await deployments.get('auctionProxy');
	const antonyAuction = (await ethers.getContractAt('AntonyAuction', auctionProxy.address)) as any;

	return {
		antonyAuction,
		auctionProxy,
	};
}

async function setPriceToOracle(aggregatorV3: any, price: bigint) {
	const priceFeedDeploy = await aggregatorV3.deploy(price);
	const priceFeed = await priceFeedDeploy.waitForDeployment();
	const priceFeedAddress = await priceFeed.getAddress();
	console.log('--priceFeedAddress: ', priceFeedAddress, price);
	return priceFeedAddress;
}

async function setPriceFeedToAuction(antonyAuction: any, testERC20: any) {
	const aggregatorV3 = await ethers.getContractFactory('AggregatorV3');
	//ETH price
	const priceFeedEthAddress = await setPriceToOracle(aggregatorV3, ethers.parseEther('10000'));
	await antonyAuction.setPriceFeed(ethers.ZeroAddress, priceFeedEthAddress);
	//USDC price
	const priceFeedUSDCAddress = await setPriceToOracle(aggregatorV3, ethers.parseEther('1'));
	await antonyAuction.setPriceFeed(await testERC20.getAddress(), priceFeedUSDCAddress);
}

async function deployERC20() {
	const testERC20Factory = await ethers.getContractFactory('TestERC20');
	const testERC20 = (await testERC20Factory.deploy()) as any;
	await testERC20.waitForDeployment();

	return testERC20;
}

async function deployERC721() {
	const [signer] = await ethers.getSigners();
	const TestERC721 = await ethers.getContractFactory('TestERC721');
	const testERC721 = (await TestERC721.deploy()) as any;
	await testERC721.waitForDeployment();

	// mint 10 NFT
	for (let i = 0; i < 10; i++) {
		await testERC721.mint(signer.address, i + 1);
	}

	return testERC721;
}
