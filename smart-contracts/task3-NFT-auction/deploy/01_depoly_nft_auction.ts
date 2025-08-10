import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import path from 'path';
import fs from 'fs';

export interface DeployData {
	proxyAddress: string;
	implAddress: string;
	abi: string[];
}
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	console.log('--Start DeployAntonyAuction');
	const deployData = await deployByUUPSUpgradeable(hre);
	saveToLocalCache(deployData, 'proxyAuction.json');

	await hre.deployments.save('auctionProxy', {
		abi: deployData.abi,
		address: deployData.proxyAddress,
		userdoc: 'Antony01',
	});
};

func.tags = ['DeployAntonyAuction'];
export default func;

function saveToLocalCache(deployData: DeployData, fileName: string) {
	const storePath = path.resolve(__dirname, `./.cache/${fileName}`);
	fs.mkdirSync(path.dirname(storePath), { recursive: true });
	fs.writeFileSync(storePath, JSON.stringify(deployData));
}

async function deployByUUPSUpgradeable(hre: HardhatRuntimeEnvironment): Promise<DeployData> {
	const antonyAuctionFactory = await hre.ethers.getContractFactory('AntonyAuction');
	const auctionProxy = await hre.upgrades.deployProxy(antonyAuctionFactory, [], {
		initializer: 'initialize',
	});
	await auctionProxy.waitForDeployment();

	const proxyAddress = await auctionProxy.getAddress();
	console.log('--proxyAddress: ', proxyAddress);

	const implAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
	console.log('--impl Address: ', implAddress);

	return {
		proxyAddress,
		implAddress,
		abi: antonyAuctionFactory.interface.format(false),
	};
}
