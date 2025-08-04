import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect, use } from 'chai';
import hre from 'hardhat';
import { getAddress, parseGwei } from 'viem';
import { TestERC20 } from '../typechain-types';

describe('AntonyAuction', function () {
	describe('Deployment', function () {
		it('Test the admin is owner', async function () {
			const { antonyAuction, deployer } = await loadFixture(deployAntonyAutionFixture);
			expect(await antonyAuction.admin()).to.equal(getAddress(deployer.account.address));
		});

		it('Create the auction', async function () {
			const { antonyAuction } = await loadFixture(deployAntonyAutionFixture);
			await antonyAuction.createAuction(
				100n,
				100n,
				getAddress('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'),
				0n
			);
			expect(await antonyAuction.nextAuctionId()).to.equal(1n);
		});
	});

	async function deployAntonyAutionFixture() {
		const [deployer, user1, user2] = await hre.viem.getWalletClients();

		const [signer, buyer] = await hre.ethers.getSigners();
		console.log('--aaaaaaaaaaaaa: ', signer.address, hre.ethers.version, hre.ethers.getSigners);
		// const antonyAuction = await hre.viem.deployContract('AntonyAuction');
		await hre.deployments.fixture(['DeployAntonyAuction']);
		const nftAuctionProxy = await hre.deployments.get('auctionProxy');
		const antonyAuction = await hre.ethers.getContractAt('AntonyAuction', nftAuctionProxy.address);
		const publicClient = await hre.viem.getPublicClient();

		// const testERC20 = await hre.viem.deployContract('TestERC20');
		const TestERC20 = await hre.ethers.getContractFactory('TestERC20');
		const testERC20 = (await TestERC20.deploy()) as TestERC20;
		await testERC20.waitForDeployment();
		const UsdcAddress = await testERC20.getAddress();

		let tx = await testERC20.connect(signer).transfer(buyer, hre.ethers.parseEther('1000'));
		await tx.wait();

		const aggreagatorV3 = await hre.ethers.getContractFactory('AggreagatorV3');
		const priceFeedEthDeploy = await aggreagatorV3.deploy(hre.ethers.parseEther('10000'));
		const priceFeedEth = await priceFeedEthDeploy.waitForDeployment();
		const priceFeedEthAddress = await priceFeedEth.getAddress();
		console.log('ethFeed: ', priceFeedEthAddress);
		const priceFeedUSDCDeploy = await aggreagatorV3.deploy(hre.ethers.parseEther('1'));
		const priceFeedUSDC = await priceFeedUSDCDeploy.waitForDeployment();
		const priceFeedUSDCAddress = await priceFeedUSDC.getAddress();
		console.log('usdcFeed: ', await priceFeedUSDCAddress);

		const token2Usd = [
			{
				token: hre.ethers.ZeroAddress,
				priceFeed: priceFeedEthAddress,
			},
			{
				token: UsdcAddress,
				priceFeed: priceFeedUSDCAddress,
			},
		];

		for (let i = 0; i < token2Usd.length; i++) {
			const { token, priceFeed } = token2Usd[i];
			await antonyAuction.setPriceFeed(token, priceFeed);
		}

		return {
			antonyAuction,
			deployer,
			user1,
			user2,
			publicClient,
			testERC20,
		};
	}
});
