// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// /*
//  * AuctionFactory.sol
//  *  - 管理拍卖创建、索引与升级
//  *  - 使用 UpgradeableBeacon + BeaconProxy 模式：更新 beacon implementation 将升级所有拍卖实例
//  *  - Factory 本身使用 UUPS 可升级（便于未来升级 factory 逻辑）
//  *
//  * 注意：需要在构建/部署脚本中引入 OpenZeppelin UpgradeableBeacon 与 BeaconProxy。
//  */
// import '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';
// import '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';

// import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
// import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';

// contract AuctionFactory is OwnableUpgradeable, UUPSUpgradeable {
// 	// beacon 地址（指向 Auction implementation）
// 	address public beacon;
// 	address[] public allAuctions;

// 	// nft => tokenId => auctionAddr
// 	mapping(address => mapping(uint256 => address)) public auctionFor;

// 	// 平台手续费接收地址和费率（bps）
// 	address public feeTo;
// 	uint256 public feeBps;

// 	event AuctionCreated(address indexed nft, uint256 indexed tokenId, address auction);
// 	event BeaconUpgraded(address newImplementation);
// 	event FeeParamsUpdated(address feeTo, uint256 feeBps);

// 	/// @custom:oz-upgrades-unsafe-allow constructor
// 	constructor() {
// 		_disableInitializers();
// 	}

// 	// 初始化 factory：_beacon 是已部署的 UpgradeableBeacon 地址
// 	function initialize(address _beacon, address _feeTo, uint256 _feeBps) external initializer {
// 		__Ownable_init();
// 		__UUPSUpgradeable_init();

// 		beacon = _beacon;
// 		feeTo = _feeTo;
// 		feeBps = _feeBps;
// 	}

// 	// 创建一场拍卖：返回 BeaconProxy 地址
// 	// seller：拍卖人地址（要保证 NFT 后续能被转移）
// 	function createAuction(
// 		address seller,
// 		address nft,
// 		uint256 tokenId,
// 		uint256 durationSeconds,
// 		uint256 reservePrice,
// 		uint256 minIncrement,
// 		address paymentToken
// 	) external returns (address auctionAddr) {
// 		require(auctionFor[nft][tokenId] == address(0), 'Factory: auction exists');

// 		// 编准 initialize calldata（与 Auction.initialize 参数顺序一致）
// 		bytes memory initData = abi.encodeWithSignature(
// 			'initialize(address,address,uint256,uint256,uint256,uint256,address,address)',
// 			seller,
// 			nft,
// 			tokenId,
// 			durationSeconds,
// 			reservePrice,
// 			minIncrement,
// 			paymentToken,
// 			address(this)
// 		);

// 		// 部署 BeaconProxy，构造函数会 delegatecall 到 implementation 的 initialize
// 		BeaconProxy proxy = new BeaconProxy(beacon, initData);
// 		auctionAddr = address(proxy);

// 		auctionFor[nft][tokenId] = auctionAddr;
// 		allAuctions.push(auctionAddr);

// 		emit AuctionCreated(nft, tokenId, auctionAddr);
// 	}

// 	// 管理员更新 beacon 的实现（调用 UpgradeableBeacon.upgradeTo）
// 	// 这个函数会由 factory 的 owner 调用，并由 factory 作为中介去调用 beacon.upgradeTo
// 	function upgradeBeaconTo(address newImplementation) external onlyOwner {
// 		UpgradeableBeacon(beacon).upgradeTo(newImplementation);
// 		emit BeaconUpgraded(newImplementation);
// 	}

// 	// 如果需要：替换 beacon（谨慎）
// 	function setBeacon(address newBeacon) external onlyOwner {
// 		beacon = newBeacon;
// 	}

// 	function setFeeParams(address _feeTo, uint256 _feeBps) external onlyOwner {
// 		feeTo = _feeTo;
// 		feeBps = _feeBps;
// 		emit FeeParamsUpdated(_feeTo, _feeBps);
// 	}

// 	// UUPS 授权（只有 owner 可以升级 factory 合约）
// 	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

// 	// view helpers
// 	function allAuctionsLength() external view returns (uint256) {
// 		return allAuctions.length;
// 	}
// }
