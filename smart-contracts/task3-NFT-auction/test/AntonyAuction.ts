import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre, { ethers, deployments } from 'hardhat';
import { getAddress, parseGwei } from 'viem';
// import { TestERC20 } from '../typechain-types';

describe('AntonyAuction', function () {
	it('Test the admin is owner', async function () {
		const { signer, antonyAuction } = await loadFixture(deployAntonyAutionFixture);
		expect(await antonyAuction.admin()).to.equal(signer.address);
	});

	it('Create the auction', async function () {
		const { antonyAuction, testERC20, testERC721, tokenId, signer, buyer, auctionProxy } =
			await loadFixture(deployAntonyAutionFixture);

		(await antonyAuction.createAuction(
			10,
			ethers.parseEther('0.01'),
			await testERC721.getAddress(),
			tokenId
		)) as any;

		expect((await antonyAuction.auctions(0)).startPrice).to.equal(ethers.parseEther('0.01'));
		console.log('--Auction created successfully');

		// 3. 购买者参与拍卖
		//   await testERC721.connect(buyer).approve(nftAuctionProxy.address, tokenId);
		// ETH参与竞价
		let tx = await antonyAuction
			.connect(buyer)
			.placeBid(0, 0, ethers.ZeroAddress, { value: ethers.parseEther('0.01') });
		await tx.wait();
		expect((await antonyAuction.auctions(0)).highestBid).to.equal(ethers.parseEther('0.01'));
		expect((await antonyAuction.auctions(0)).highestBidder).to.equal(buyer.address);
		console.log('--place Bid successfully');

		// USDC参与竞价
		tx = await testERC20.connect(buyer).approve(auctionProxy.address, ethers.MaxUint256);
		await tx.wait();
		tx = await antonyAuction
			.connect(buyer)
			.placeBid(0, ethers.parseEther('101'), await testERC20.getAddress());
		await tx.wait();

		// 4. 结束拍卖
		// 等待 10 s
		await new Promise(resolve => setTimeout(resolve, 10 * 1000));
		console.log('--signer.address: ', signer.address, antonyAuction);
		await antonyAuction.connect(signer).endAuction(0);

		// 验证结果
		const auctionResult = await antonyAuction.auctions(0);
		console.log('结束拍卖后读取拍卖成功：：', auctionResult);
		expect(auctionResult.highestBidder).to.equal(buyer.address);
		expect(auctionResult.highestBid).to.equal(ethers.parseEther('101'));

		// 验证 NFT 所有权
		const owner = await testERC721.ownerOf(tokenId);
		console.log('owner::', owner, buyer.address);
		expect(owner).to.equal(buyer.address);
	});

	async function deployAntonyAutionFixture() {
		const [signer, buyer] = await ethers.getSigners();
		await deployments.fixture(['DeployAntonyAuction']);

		const auctionProxy = await deployments.get('auctionProxy');
		const antonyAuction = (await ethers.getContractAt(
			'AntonyAuction',
			auctionProxy.address
		)) as any;

		const testERC20 = await deployERC20();
		await setPriceFeedToAuction(antonyAuction, testERC20);
		const testERC721 = await deployERC721();

		const tokenId = 1;
		// 给代理合约授权
		await testERC721.connect(signer).setApprovalForAll(auctionProxy.address, true);

		return {
			signer,
			buyer,
			antonyAuction,
			auctionProxy,
			tokenId,
			testERC20,
			testERC721,
		};
	}
});

async function setPriceToOracle(aggregatorV3: any, price: bigint) {
	const priceFeedDeploy = await aggregatorV3.deploy(price);
	const priceFeed = await priceFeedDeploy.waitForDeployment();
	const priceFeedAddress = await priceFeed.getAddress();
	console.log('--priceFeedAddress: ', priceFeedAddress, price);
	return priceFeedAddress;
}

async function setPriceFeedToAuction(antonyAuction: any, testERC20: any) {
	const aggregatorV3 = await ethers.getContractFactory('AggregatorV3');

	const priceFeedEthAddress = await setPriceToOracle(aggregatorV3, ethers.parseEther('10000'));
	await antonyAuction.setPriceFeed(ethers.ZeroAddress, priceFeedEthAddress);

	const priceFeedUSDCAddress = await setPriceToOracle(aggregatorV3, ethers.parseEther('1'));
	await antonyAuction.setPriceFeed(await testERC20.getAddress(), priceFeedUSDCAddress);
}

async function deployERC20() {
	const [signer, buyer] = await ethers.getSigners();

	const testERC20Factory = await ethers.getContractFactory('TestERC20');
	const testERC20 = (await testERC20Factory.deploy()) as any;
	await testERC20.waitForDeployment();

	let tx = await testERC20.connect(signer).transfer(buyer, ethers.parseEther('1000'));
	await tx.wait();

	return testERC20;
}

async function deployERC721() {
	const [signer] = await ethers.getSigners();

	// 1. 部署 ERC721 合约
	const TestERC721 = await ethers.getContractFactory('TestERC721');
	const testERC721 = (await TestERC721.deploy()) as any;
	await testERC721.waitForDeployment();

	// mint 10个 NFT
	for (let i = 0; i < 10; i++) {
		await testERC721.mint(signer.address, i + 1);
	}

	return testERC721;
}
