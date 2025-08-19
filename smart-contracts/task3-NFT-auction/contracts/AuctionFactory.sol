// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import './AntonyAuction.sol';
import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import 'hardhat/console.sol';

contract AuctionFactory {
	address public immutable auctionImplementation;
	// event AuctionCreated(address proxy, uint256 tokenId);
	constructor(address _auctionImplementation) {
		auctionImplementation = _auctionImplementation;
	}

	address[] public auctions;

	mapping(uint256 tokenId => ERC1967Proxy) public auctionMap;

	event AuctionCreated(address indexed auctionAddress, uint256 tokenId);

	// Create a new auction
	function createAuction(
		uint256 duration,
		uint256 startPrice,
		address nftContractAddress,
		uint256 tokenId
	) external returns (address) {
		// AntonyAuction auction = new AntonyAuction();
		// auction.initialize();
		// auctions.push(address(auction));
		// auctionMap[tokenId] = auction;

		// emit AuctionCreated(address(auction), tokenId);
		// return address(auction);

		console.log('--: ', 'createAuction', auctionImplementation);
		ERC1967Proxy proxy = new ERC1967Proxy(
			0x5FbDB2315678afecb367f032d93F642f64180aa3,
			abi.encodeWithSelector(AntonyAuction.initialize.selector)
		);

		emit AuctionCreated(address(proxy), tokenId);

		auctions.push(address(proxy));
		auctionMap[tokenId] = proxy;
		return address(proxy);
	}

	function getAuctions() external view returns (address[] memory) {
		return auctions;
	}

	function getAuction(uint256 tokenId) external view returns (address) {
		require(tokenId < auctions.length, 'tokenId out of bounds');
		return auctions[tokenId];
	}
}
