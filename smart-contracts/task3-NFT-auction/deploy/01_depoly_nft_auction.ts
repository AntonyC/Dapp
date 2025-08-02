import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import path from 'path';
import fs from 'fs';

const func: DeployFunction = async function ({
	getNamedAccounts,
	deployments,
	ethers,
	upgrades,
}: HardhatRuntimeEnvironment) {
	const { deployer } = await getNamedAccounts();
	console.log('deployer---:', deployer);

	const antonyAuction = await ethers.getContractFactory('AntonyAuction');
	const auctionProxy = await upgrades.deployProxy(antonyAuction, [], {
		initializer: 'initialize',
	});
	await auctionProxy.waitForDeployment();

	const proxyAddress = await auctionProxy.getAddress();
	console.log('proxyAddress: ', proxyAddress);
	const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
	console.log('impl Address: ', implAddress);

	// const storePath = path.resolve(__dirname, './.cache/proxyAuction.json');
	// fs.mkdirSync(path.dirname(storePath), { recursive: true });
	// fs.writeFileSync(
	// 	storePath,
	// 	JSON.stringify({
	// 		proxyAddress,
	// 		implAddress,
	// 		abi: antonyAuction.interface.format(false),
	// 	})
	// );

	await deployments.save('auctionProxy', {
		abi: antonyAuction.interface.format(true),
		address: proxyAddress,
		// args: [],
		// log: true,
	});
	// await deploy('AntonyAuction', { from: deployer, log: true });
};

export default func;
func.tags = ['AntonyAuction'];
