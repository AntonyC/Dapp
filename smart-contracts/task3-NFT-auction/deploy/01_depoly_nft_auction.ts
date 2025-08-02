import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function ({
	getNamedAccounts,
	deployments,
	ethers,
}: HardhatRuntimeEnvironment) {
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	console.log('deployer---:', deployer);

	const antonyAuction = await ethers.getContractFactory('AntonyAuction');
	console.log('antonyAuction---:', antonyAuction);
	// await deploy('AntonyAuction', { from: deployer, log: true });
};

export default func;
func.tags = ['AntonyAuction'];
