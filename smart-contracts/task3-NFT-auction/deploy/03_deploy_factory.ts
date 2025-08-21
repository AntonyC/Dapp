import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { type DeployData } from './01_depoly_nft_auction';
import path from 'path';
import fs from 'fs';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const deployData = await getDeployData('proxyAuction.json');

	const auctionFactoryFactory = await hre.ethers.getContractFactory('AuctionFactory');
	const auctionFactory = (await auctionFactoryFactory.deploy(deployData.implAddress)) as any;
	await auctionFactory.waitForDeployment();

	await hre.deployments.save('auctionFactory', {
		abi: auctionFactoryFactory.interface.format(false),
		address: auctionFactory.getAddress(),
		userdoc: 'Antony03',
	});
};

func.tags = ['DeployAuctionFactory'];
export default func;

async function getDeployData(fileName: string): Promise<DeployData> {
	const storePath = path.resolve(__dirname, `./.cache/${fileName}`);
	const storeData = fs.readFileSync(storePath, 'utf-8');
	const { proxyAddress, implAddress, abi } = JSON.parse(storeData);

	return {
		proxyAddress,
		implAddress,
		abi: abi,
	};
}
