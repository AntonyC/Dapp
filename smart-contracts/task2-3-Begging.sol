//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Begging {
// ### ✅ 作业3：编写一个讨饭合约
// 任务目标
// 1. 使用 Solidity 编写一个合约，允许用户向合约地址发送以太币。
// 2. 记录每个捐赠者的地址和捐赠金额。
// 3. 允许合约所有者提取所有捐赠的资金。

// 任务步骤
// 1. 编写合约
//   - 创建一个名为 BeggingContract 的合约。
//   - 合约应包含以下功能：
//   - 一个 mapping 来记录每个捐赠者的捐赠金额。
//   - 一个 donate 函数，允许用户向合约发送以太币，并记录捐赠信息。
//   - 一个 withdraw 函数，允许合约所有者提取所有资金。
//   - 一个 getDonation 函数，允许查询某个地址的捐赠金额。
//   - 使用 payable 修饰符和 address.transfer 实现支付和提款。
// 2. 部署合约
//   - 在 Remix IDE 中编译合约。
//   - 部署合约到 Goerli 或 Sepolia 测试网。
// 3. 测试合约
//   - 使用 MetaMask 向合约发送以太币，测试 donate 功能。
//   - 调用 withdraw 函数，测试合约所有者是否可以提取资金。
//   - 调用 getDonation 函数，查询某个地址的捐赠金额。

// 任务要求
// 1. 合约代码：
//   - 使用 mapping 记录捐赠者的地址和金额。
//   - 使用 payable 修饰符实现 donate 和 withdraw 函数。
//   - 使用 onlyOwner 修饰符限制 withdraw 函数只能由合约所有者调用。
// 2. 测试网部署：
//   - 合约必须部署到 Goerli 或 Sepolia 测试网。
// 3. 功能测试：
//   - 确保 donate、withdraw 和 getDonation 函数正常工作。

// 提交内容
// 1. 合约代码：提交 Solidity 合约文件（如 BeggingContract.sol）。
// 2. 合约地址：提交部署到测试网的合约地址。 0x56e723faa2FB59BD5a0Bb67dB3BD20b33394d1b3
// 3. 测试截图：提交在 Remix 或 Etherscan 上测试合约的截图。
    address public owner;
    mapping (address => uint256) private donations;

    constructor(uint256 _durationInSeconds) {
        endTime = _durationInSeconds + block.timestamp;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    function donate() public payable isDonationTime {
        require(msg.value > 0, "Donation must be greater than 0");
        donations[msg.sender] += msg.value;
        donors.push(msg.sender);
        emit Donation(msg.sender, msg.value);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }
    
    function getDonate(address _donor) public view returns (uint256) {
        return donations[_donor];
    }

    receive() external payable isDonationTime {
        donate();
    }
    
// 额外挑战（可选）
// 1. 捐赠事件：添加 Donation 事件，记录每次捐赠的地址和金额。
// 2. 捐赠排行榜：实现一个功能，显示捐赠金额最多的前 3 个地址。
// 3. 时间限制：添加一个时间限制，只有在特定时间段内才能捐赠。

    // 记录所有捐赠者地址，用于计算排行榜
    address[] private donors;
    // 捐赠起止时间
    uint256 public endTime;

    event Donation(address indexed donor, uint256 amount);

    modifier isDonationTime() {
        require(block.timestamp <= endTime, "Donations are closed");
        _;
    }

        // 返回捐赠最多的前 3 个地址
    function getTop3Donors() public view returns (address[3] memory topDonors) {
        uint256[3] memory topAmounts;
        for (uint256 i = 0; i < donors.length; i++) {
            uint256 amount = donations[donors[i]];
            if (amount > topAmounts[0]) {
                // 插入第一名
                topAmounts[2] = topAmounts[1];
                topDonors[2] = topDonors[1];
                topAmounts[1] = topAmounts[0];
                topDonors[1] = topDonors[0];
                topAmounts[0] = amount;
                topDonors[0] = donors[i];
            } else if (amount > topAmounts[1]) {
                // 插入第二名
                topAmounts[2] = topAmounts[1];
                topDonors[2] = topDonors[1];
                topAmounts[1] = amount;
                topDonors[1] = donors[i];
            } else if (amount > topAmounts[2]) {
                // 插入第三名
                topAmounts[2] = amount;
                topDonors[2] = donors[i];
            }
        }
    }

    function resetDuration(uint256 _durationInSeconds) public onlyOwner {
        endTime = block.timestamp + _durationInSeconds;
    }

    function getBlockTimestap() public view returns (uint256) {
        return block.timestamp;
    }
}
