import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deploy } = hre.deployments;
	const { deployer } = await hre.getNamedAccounts();

	// the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
	await deploy('AuctionFactory', {
		from: deployer,
		gasLimit: 4000000,
		args: [],
	});
};

func.tags = ['DeployAuctionFactory'];
export default func;
