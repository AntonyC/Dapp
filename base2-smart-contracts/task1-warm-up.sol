//SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract WarmUp {

    // ### 1.  ✅ 创建一个名为Voting的合约，包含以下功能：
    // - 一个mapping来存储候选人的得票数
    // - 一个vote函数，允许用户投票给某个候选人
    // - 一个getVotes函数，返回某个候选人的得票数
    // - 一个resetVotes函数，重置所有候选人的得票数
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

    //### 2. ✅ 反转字符串 (Reverse String)
    //- 题目描述：反转一个字符串。输入 "abcde"，输出 "edcba"
    function reverseString(string calldata str)pure external  returns (string memory) {
        bytes memory strBytes = bytes(str); 
        uint256 len = strBytes.length; 

        for (uint256 i = 0; i < len / 2; i ++){
            bytes1 temp = strBytes[i];
            strBytes[i] = strBytes[len - 1 -i];
            strBytes[len - 1 -i] = temp;
        }

        return string(strBytes);
    }

    // ### 3. ✅  用 solidity 实现整数转罗马数字
    string[13] private romanSymbols = [
        "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
    ];
    uint16[13] private romanValues = [
        1000, 900, 500,  400, 100,   90,  50,   40,  10,    9,   5,   4,   1
    ];

    function integerToRoman(uint256 num) view external returns (string memory) {
        require(num > 0 && num <= 3999, "Input must be between 1 and 3999");

        bytes memory result;

        for (uint256 i = 0; i < romanValues.length; i++) {
            while (num >= romanValues[i]) {
                num -= romanValues[i];
                result = bytes.concat(result, bytes(romanSymbols[i]));
            }
        }

        return string(result);
    }

    // ### 4. ✅  用 solidity 实现罗马数字转数整数
    function romanToInteger(string calldata roman) pure external returns (uint256) {
        bytes memory romans = bytes(roman);
        uint256 len = romans.length;
        require(len > 0, "Roman numeral cannot be empty");

        uint256 result = charValue(romans, len -1);

        for (uint256 i = len -1; i > 0; i--){
            uint256 currentIndex = i - 1;
            if (charValue(romans, currentIndex) >= charValue(romans, currentIndex + 1)){
                result += charValue(romans, currentIndex);
            } else{
                result -= charValue(romans, currentIndex);
            }
        }
        return result;
    }

    function charValue(bytes memory s, uint256 index) private pure returns (uint256) {
        bytes1 c = s[index];

        if (c == "I") return 1;
        if (c == "V") return 5;
        if (c == "X") return 10;
        if (c == "L") return 50;
        if (c == "C") return 100;
        if (c == "D") return 500;
        if (c == "M") return 1000;

        revert("Invalid character");
    }

    //### 5. ✅  合并两个有序数组 (Merge Sorted Array)
    //- 题目描述：将两个有序数组合并为一个有序数组。
    
    
    //### 6. ✅  二分查找 (Binary Search)
    //- 题目描述：在一个有序数组中查找目标值。
}
