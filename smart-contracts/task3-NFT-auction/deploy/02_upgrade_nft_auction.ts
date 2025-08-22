import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { type DeployData } from './01_depoly_nft_auction';
import path from 'path';
import fs from 'fs';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	console.log('--Start UpgradeAntonyAuction');
	const deployData = await getDeployData('proxyAuction.json');
	const proxyAddressV2 = await upgradeContract(hre, deployData);
	console.log('--upgraded address: ', proxyAddressV2);
	await hre.deployments.save('auctionProxyV2', {
		abi: deployData.abi,
		address: proxyAddressV2,
		userdoc: 'Antony02',
	});
};

func.tags = ['UpgradeAntonyAuction'];
export default func;

async function upgradeContract(
	hre: HardhatRuntimeEnvironment,
	deployData: DeployData
): Promise<string> {
	const NftAuctionV2 = await hre.ethers.getContractFactory('AntonyAuctionV2');
	const auctionProxyV2 = await hre.upgrades.upgradeProxy(deployData.proxyAddress, NftAuctionV2, {
		call: 'admin',
	});
	await auctionProxyV2.waitForDeployment();
	return await auctionProxyV2.getAddress();
}

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
