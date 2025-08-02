import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
	solidity: '0.8.28',
	namedAccounts: {
		deployer: 0,
		user1: 1,
		user2: 2,
	},
};

export default config;
