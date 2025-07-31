


module.exports = async ({getNamedAccounts, deployments}) => {
  const {deployIfDifferent, log, save} = deployments;
  const {deployer} = await getNamedAccounts();
  console.log('deployer---:', deployer);

  // const deployResult = await deploy('Token', {
  //   from: deployer,
  //   args: ['hello', 100],
  // });
  // if (deployResult.newlyDeployed) {
  //   log(
  //     `contract Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
  //   );
  // }
};
module.exports.tags = ['Token'];