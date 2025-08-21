// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import './AntonyAuction.sol';
import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import 'hardhat/console.sol';

contract AuctionFactory {
	address public auctionImplementation;
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
		console.log('--: ', 'createAuction');
		ERC1967Proxy proxy = new ERC1967Proxy(
			auctionImplementation,
			abi.encodeWithSelector(AntonyAuction.initialize.selector, msg.sender)
		);

		emit AuctionCreated(address(proxy), tokenId);

		auctions.push(address(proxy));
		auctionMap[tokenId] = proxy;
		return address(proxy);
	}

	function getAuctions() external view returns (address[] memory) {
		return auctions;
	}

	// function getAuction(uint256 tokenId) external view returns (ERC1967Proxy memory) {
	// 	return auctionMap[tokenId];
	// }

	function getAuction(uint256 index) external view returns (address) {
		require(index < auctions.length, 'tokenId out of bounds');
		return auctions[index];
	}
}
