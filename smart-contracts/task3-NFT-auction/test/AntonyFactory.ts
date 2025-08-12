import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre, { ethers, deployments, upgrades } from 'hardhat';
import { getAddress, getContract, parseGwei } from 'viem';
// import { TestERC20 } from '../typechain-types';

describe('AntonyFactory', function () {
	it('Test the admin is owner', async function () {
		const ONE_WEEK_IN_SECS = 7 * 24 * 60 * 60;
		const tokenId = 1;

		const { signer, buyer1, buyer2, antonyAuction, testERC721 } =
			await loadFixture(deployAntonyAutionFixture);
		return;
		// 1. deploy implementation
		const Auction = await ethers.getContractFactory('Auction');
		const impl = await Auction.deploy();
		await impl.deployed();

		// 2. deploy UpgradeableBeacon (beacon.owner initially deployer)
		const UpgradeableBeacon = await ethers.getContractFactory('UpgradeableBeacon');
		const beacon = await UpgradeableBeacon.deploy(impl.address);
		await beacon.deployed();

		// 3. deploy AuctionFactory and transfer beacon ownership to factory OR have factory deploy beacon
		const Factory = await ethers.getContractFactory('AuctionFactory');
		const factory = await Factory.deploy();
		await factory.deployed();
		await factory.initialize(beacon.address, signer.address, 200); // 2%
		await beacon.transferOwnership(factory.address); // 让 factory 成为 beacon 的 owner

		// 4. create auction
		await factory.createAuction(
			signer.address,
			testERC721,
			tokenId,
			3600,
			ethers.parseEther('0.1'),
			ethers.parseEther('0.01'),
			ethers.ZeroAddress
		);

		// 5. upgrade auction implementation (factory owner)
		const NewAuctionImpl = await ethers.getContractFactory('AuctionV2');
		const newImpl = await NewAuctionImpl.deploy();
		await newImpl.deployed();
		await factory.upgradeBeaconTo(newImpl.address); // 所有拍卖实例使用新逻辑
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
	return await priceFeed.getAddress();
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
	const testERC721Factory = await ethers.getContractFactory('TestERC721');
	const testERC721 = (await testERC721Factory.deploy()) as any;
	await testERC721.waitForDeployment();

	// mint 10 NFT
	for (let i = 0; i < 10; i++) {
		await testERC721.mint(signer.address, i + 1);
	}

	return testERC721;
}
