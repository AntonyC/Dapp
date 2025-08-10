// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import { AggregatorV3Interface } from '@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol';

import 'hardhat/console.sol';

contract AntonyAuction is Initializable, UUPSUpgradeable {
	struct Auction {
		address seller;
		uint256 duration;
		uint256 startPrice;
		uint256 startTime;
		bool ended;
		address highestBidder;
		uint256 highestBid;
		address nftContract;
		uint256 tokenId;
		// 0x means eth，others means erc20
		// 0x0000000000000000000000000000000000000000 表示eth
		address tokenAddress;
	}

	mapping(uint256 => Auction) public auctions;
	uint256 public nextAuctionId;
	address public admin;

	mapping(address => AggregatorV3Interface) public priceFeeds;

	function initialize() public initializer {
		admin = msg.sender;
	}

	function setPriceFeed(address tokenAddress, address _priceFeed) public {
		priceFeeds[tokenAddress] = AggregatorV3Interface(_priceFeed);
	}

	// ETH -> USD => 1766 7512 1800 => 1766.75121800
	// USDC -> USD => 9999 4000 => 0.99994000
	function getChainlinkDataFeedLatestAnswer(address tokenAddress) public view returns (int) {
		AggregatorV3Interface priceFeed = priceFeeds[tokenAddress];
		// prettier-ignore
		(
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
		return answer;
	}

	function createAuction(
		uint256 _duration,
		uint256 _startPrice,
		address _nftAddress,
		uint256 _tokenId
	) public {
		require(msg.sender == admin, 'Only admin can create auctions');

		require(_duration >= 60 * 60 * 24, 'Duration must be greater than 1 day');
		require(_startPrice > 0, 'Start price must be greater than 0');

		// Transfer NFT
		// IERC721(_nftAddress).approve(address(this), _tokenId);
		IERC721(_nftAddress).safeTransferFrom(msg.sender, address(this), _tokenId);
		console.log('--IERC721(_nftAddress).safeTransferFrom: ', msg.sender, address(this), _tokenId);
		auctions[nextAuctionId] = Auction({
			seller: msg.sender,
			duration: _duration,
			startPrice: _startPrice,
			ended: false,
			highestBidder: address(0),
			highestBid: 0,
			startTime: block.timestamp,
			nftContract: _nftAddress,
			tokenId: _tokenId,
			tokenAddress: address(0)
		});

		nextAuctionId++;
	}

	// TODO: ERC20 也能参加
	function placeBid(uint256 _auctionID, uint256 amount, address _tokenAddress) external payable {
		Auction storage auction = auctions[_auctionID];
		require(
			!auction.ended && auction.startTime + auction.duration > block.timestamp,
			'Auction has ended'
		);
		// Check whether the bid is higher than the current highest bid.
		uint payValue;
		if (_tokenAddress != address(0)) {
			// Check if it is ERC20
			payValue = amount * uint(getChainlinkDataFeedLatestAnswer(_tokenAddress));
		} else {
			// ETH
			amount = msg.value;

			payValue = amount * uint(getChainlinkDataFeedLatestAnswer(address(0)));
		}

		uint startPriceValue = auction.startPrice *
			uint(getChainlinkDataFeedLatestAnswer(auction.tokenAddress));

		uint highestBidValue = auction.highestBid *
			uint(getChainlinkDataFeedLatestAnswer(auction.tokenAddress));

		require(
			payValue >= startPriceValue && payValue > highestBidValue,
			'Bid must be higher than the current highest bid'
		);

		// Transfer ERC20 to auction contract
		if (_tokenAddress != address(0)) {
			IERC20(_tokenAddress).transferFrom(msg.sender, address(this), amount);
		}

		// Return the heightest bid
		if (auction.highestBid > 0) {
			if (auction.tokenAddress == address(0)) {
				payable(auction.highestBidder).transfer(auction.highestBid);
			} else {
				// Return the previous ERC20
				IERC20(auction.tokenAddress).transfer(auction.highestBidder, auction.highestBid);
			}
		}

		auction.tokenAddress = _tokenAddress;
		auction.highestBid = amount;
		auction.highestBidder = msg.sender;
	}

	function endAuction(uint256 _auctionID) external {
		Auction storage auction = auctions[_auctionID];
		require(
			!auction.ended && (auction.startTime + auction.duration) <= block.timestamp,
			'Auction has not ended'
		);
		// Transfer NFT to winner
		IERC721(auction.nftContract).safeTransferFrom(
			address(this),
			auction.highestBidder,
			auction.tokenId
		);
		// Transfer ETH to seller
		// payable(address(this)).transfer(address(this).balance);
		auction.ended = true;
	}

	function _authorizeUpgrade(address) internal view override {
		console.log('--_authorizeUpgrade called');
		require(msg.sender == admin, 'Only admin can upgrade');
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external pure returns (bytes4) {
		console.log('--onERC721Received: ', operator, from, tokenId);
		return this.onERC721Received.selector;
	}
}
