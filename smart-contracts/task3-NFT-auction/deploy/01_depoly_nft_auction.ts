import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { viem, upgrades } from 'hardhat';

const func: DeployFunction = async function ({
	getNamedAccounts,
	deployments,
}: HardhatRuntimeEnvironment) {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	console.log('deployer---:', deployer);

	await deploy('AntonyAuction', { from: deployer, log: true });
};

export default func;
func.tags = ['AntonyAuction'];
