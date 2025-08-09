import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre, { ethers, deployments } from 'hardhat';
import { getAddress, parseGwei } from 'viem';
// import { TestERC20 } from '../typechain-types';

describe('AntonyAuction', function () {
	describe('Deployment', function () {
		it('Test the admin is owner', async function () {
			const { signer } = await loadFixture(deployAntonyAutionFixture);
			console.log('--signer: ', signer.address);
			// expect(await antonyAuction.admin()).to.equal(getAddress(deployer.account.address));
		});

		// it('Create the auction', async function () {
		// 	const { antonyAuction } = await loadFixture(deployAntonyAutionFixture);
		// 	await antonyAuction.createAuction(
		// 		100n,
		// 		100n,
		// 		getAddress('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'),
		// 		0n
		// 	);
		// 	expect(await antonyAuction.nextAuctionId()).to.equal(1n);
		// });
	});

	async function deployAntonyAutionFixture() {
		const [signer, buyer] = await ethers.getSigners();
		await deployments.fixture(['DeployAntonyAuction']);

		const auctionProxy = await deployments.get('auctionProxy');
		const nftAuction = (await ethers.getContractAt('AntonyAuction', auctionProxy.address)) as any;

		const TestERC20 = await ethers.getContractFactory('TestERC20');
		const testERC20 = (await TestERC20.deploy()) as any;
		await testERC20.waitForDeployment();
		const UsdcAddress = await testERC20.getAddress();

		let tx = await testERC20.connect(signer).transfer(buyer, ethers.parseEther('1000'));
		await tx.wait();

		const aggreagatorV3 = await ethers.getContractFactory('AggreagatorV3');
		const priceFeedEthDeploy = await aggreagatorV3.deploy(ethers.parseEther('10000'));
		const priceFeedEth = await priceFeedEthDeploy.waitForDeployment();
		const priceFeedEthAddress = await priceFeedEth.getAddress();
		console.log('ethFeed: ', priceFeedEthAddress);
		const priceFeedUSDCDeploy = await aggreagatorV3.deploy(ethers.parseEther('1'));
		const priceFeedUSDC = await priceFeedUSDCDeploy.waitForDeployment();
		const priceFeedUSDCAddress = await priceFeedUSDC.getAddress();
		console.log('usdcFeed: ', await priceFeedUSDCAddress);

		const token2Usd = [
			{
				token: ethers.ZeroAddress,
				priceFeed: priceFeedEthAddress,
			},
			{
				token: UsdcAddress,
				priceFeed: priceFeedUSDCAddress,
			},
		];

		for (let i = 0; i < token2Usd.length; i++) {
			const { token, priceFeed } = token2Usd[i];
			await nftAuction.setPriceFeed(token, priceFeed);
		}
		// nftAuctionProxy.setPriceFeed()

		// 1. 部署 ERC721 合约
		const TestERC721 = await ethers.getContractFactory('TestERC721');
		const testERC721 = (await TestERC721.deploy()) as any;
		await testERC721.waitForDeployment();
		const testERC721Address = await testERC721.getAddress();
		console.log('testERC721Address::', testERC721Address);

		// mint 10个 NFT
		for (let i = 0; i < 10; i++) {
			await testERC721.mint(signer.address, i + 1);
		}

		const tokenId = 1;

		// 给代理合约授权
		await testERC721.connect(signer).setApprovalForAll(auctionProxy.address, true);

		(await nftAuction.createAuction(
			10,
			ethers.parseEther('0.01'),
			testERC721Address,
			tokenId
		)) as any;

		const auction = await nftAuction.auctions(0);

		console.log('创建拍卖成功：：', auction);

		// 3. 购买者参与拍卖
		//   await testERC721.connect(buyer).approve(nftAuctionProxy.address, tokenId);
		// ETH参与竞价
		tx = await nftAuction
			.connect(buyer)
			.placeBid(0, 0, ethers.ZeroAddress, { value: ethers.parseEther('0.01') });
		await tx.wait();

		// USDC参与竞价
		tx = await testERC20.connect(buyer).approve(auctionProxy.address, ethers.MaxUint256);
		await tx.wait();
		tx = await nftAuction.connect(buyer).placeBid(0, ethers.parseEther('101'), UsdcAddress);
		await tx.wait();

		// 4. 结束拍卖
		// 等待 10 s
		await new Promise(resolve => setTimeout(resolve, 10 * 1000));
		console.log('--signer.address: ', signer.address, nftAuction);
		await nftAuction.connect(signer).endAuction(0);

		// 验证结果
		const auctionResult = await nftAuction.auctions(0);
		console.log('结束拍卖后读取拍卖成功：：', auctionResult);
		expect(auctionResult.highestBidder).to.equal(buyer.address);
		expect(auctionResult.highestBid).to.equal(ethers.parseEther('101'));

		// 验证 NFT 所有权
		const owner = await testERC721.ownerOf(tokenId);
		console.log('owner::', owner, buyer.address);
		expect(owner).to.equal(buyer.address);

		return {
			signer,
			// antonyAuction,
			// publicClient,
			testERC20,
		};
	}
});
