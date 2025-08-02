// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import './AntonyAuction.sol';

contract AntonyAuctionV2 is AntonyAuction {
	function testHello() public pure returns (string memory) {
		return 'Hello World, I am version 2!';
	}
}
