//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

// ### 1.  ✅ 创建一个名为Voting的合约，包含以下功能：
// - 一个mapping来存储候选人的得票数
// - 一个vote函数，允许用户投票给某个候选人
// - 一个getVotes函数，返回某个候选人的得票数
// - 一个resetVotes函数，重置所有候选人的得票数

contract Voting {
    mapping(address => mapping (uint256 => uint256)) private  _voteCounts;
    uint256 private _version = 0;

    function vote(address candidate) external {
        _voteCounts[candidate][_version] += 1;
    }

    function getVotes(address candidate) external view returns (uint256) {
        return _voteCounts[candidate][_version];
    }

    function resetVotes() external{
        _version++;
    }
}

//### 2. ✅ 反转字符串 (Reverse String)
//- 题目描述：反转一个字符串。输入 "abcde"，输出 "edcba"
contract StringReverser {

    function reverse(string calldata str)pure external  returns (string memory) {
        bytes memory strBytes = bytes(str); 
        uint256 len = strBytes.length; 

        for (uint256 i = 0; i < len / 2; i ++){
            bytes1 temp = strBytes[i];
            strBytes[i] = strBytes[len - 1 -i];
            strBytes[len - 1 -i] = temp;
        }

        return string(strBytes);
    }
}

### 3. ✅  用 solidity 实现整数转罗马数字
- 题目描述在 https://leetcode.cn/problems/roman-to-integer/description/3.


### 4. ✅  用 solidity 实现罗马数字转数整数
- 题目描述在 https://leetcode.cn/problems/integer-to-roman/description/


### 5. ✅  合并两个有序数组 (Merge Sorted Array)
- 题目描述：将两个有序数组合并为一个有序数组。


### 6. ✅  二分查找 (Binary Search)
- 题目描述：在一个有序数组中查找目标值。




