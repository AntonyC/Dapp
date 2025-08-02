import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import path from 'path';
import fs from 'fs';

interface DeployData {
	proxyAddress: string;
	implAddress: string;
	abi: string[];
}
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer } = await hre.getNamedAccounts();
	console.log('deployer---:', deployer);

	const deployData = await getDeployData(hre);
	saveToLocalCache(deployData, 'proxyAuction.json');

	await hre.deployments.save('auctionProxy', {
		abi: deployData.abi,
		address: deployData.proxyAddress,
		// args: [],
		// log: true,
	});
	// await deploy('AntonyAuction', { from: deployer, log: true });
};

export default func;
func.tags = ['AntonyAuction'];

function saveToLocalCache(deployData: DeployData, fileName: string) {
	const storePath = path.resolve(__dirname, `./.cache/${fileName}`);
	fs.mkdirSync(path.dirname(storePath), { recursive: true });
	fs.writeFileSync(storePath, JSON.stringify(deployData));
}

async function getDeployData(hre: HardhatRuntimeEnvironment): Promise<DeployData> {
	const antonyAuction = await hre.ethers.getContractFactory('AntonyAuction');
	const auctionProxy = await hre.upgrades.deployProxy(antonyAuction, [], {
		initializer: 'initialize',
	});
	await auctionProxy.waitForDeployment();

	const proxyAddress = await auctionProxy.getAddress();
	console.log('proxyAddress: ', proxyAddress);
	const implAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
	console.log('impl Address: ', implAddress);

	return {
		proxyAddress,
		implAddress,
		abi: antonyAuction.interface.format(false),
	};
}
