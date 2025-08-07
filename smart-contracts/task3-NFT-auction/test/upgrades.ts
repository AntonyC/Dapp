import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre, { ethers, deployments, upgrades } from 'hardhat';
import { getAddress, parseGwei } from 'viem';

describe('Upgrades', function () {
	async function deployAntonyAutionFixture() {
		const [owner, user1, user2] = await hre.viem.getWalletClients();
		const antonyAuction = await hre.viem.deployContract('AntonyAuction');
		const publicClient = await hre.viem.getPublicClient();

		const [signer, buyer] = await ethers.getSigners();

		// 1. 部署业务合约
		await deployments.fixture(['DeployAntonyAuction']);

		const nftAuctionProxy = await deployments.get('auctionProxy');
		console.log(nftAuctionProxy);

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
		await testERC721.connect(signer).setApprovalForAll(nftAuctionProxy.address, true);

		// 2. 调用 createAuction 方法创建拍卖
		const nftAuction = await ethers.getContractAt('AntonyAuction', nftAuctionProxy.address);

		await nftAuction.createAuction(100 * 1000, ethers.parseEther('0.01'), testERC721Address, 1);

		const auction = await nftAuction.auctions(0);
		console.log('创建拍卖成功：：', auction);

		const implAddress1 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
		// 3. 升级合约
		await deployments.fixture(['UpgradeAntonyAuction']);

		const implAddress2 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
		// 4. 读取合约的 auction[0]
		const auction2 = await nftAuction.auctions(0);
		console.log('升级后读取拍卖成功：：', auction2);

		console.log('implAddress1::', implAddress1, '\nimplAddress2::', implAddress2);

		const nftAuctionV2 = await ethers.getContractAt('AntonyAuctionV2', nftAuctionProxy.address);
		const hello = await nftAuctionV2.testHello();
		console.log('hello::', hello);

		// console.log("创建拍卖成功：：", await nftAuction.auctions(0));
		expect(auction2.startTime).to.equal(auction.startTime);
		// expect(implAddress1).to.not(implAddress2);

		return {
			antonyAuction,
			owner,
			user1,
			user2,
			publicClient,
		};
	}

	describe('Deployment', function () {
		it('Test the admin is owner', async function () {
			const { antonyAuction, owner } = await loadFixture(deployAntonyAutionFixture);
			// expect(await antonyAuction.read.admin()).to.equal(getAddress(owner.account.address));
		});

		// it('Create the auction', async function () {
		// 	const { antonyAuction } = await loadFixture(deployAntonyAutionFixture);
		// 	await antonyAuction.write.createAuction([
		// 		100n,
		// 		100n,
		// 		getAddress('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'),
		// 		0n,
		// 	]);

		// 	expect(await antonyAuction.read.nextAuctionId()).to.equal(1n);
		// });
	});
});
