import { type HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'dotenv/config';
import 'hardhat-deploy';
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
	solidity: '0.8.28',
	networks: {
		sepolia: {
			url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
			accounts: [`${process.env.PK}`],
		},
	},
	namedAccounts: {
		deployer: 0,
		user1: 1,
		user2: 2,
	},
};

export default config;

task('env', 'Print env values').setAction(async hre => {
	console.log('-INFURA_API_KEY-: ', process.env.INFURA_API_KEY);
	console.log('-PK-: ', process.env.PK);
});
