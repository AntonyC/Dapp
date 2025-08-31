// ✅ 作业 1：ERC20 代币
// 任务：参考 openzeppelin-contracts/contracts/token/ERC20/IERC20.sol实现一个简单的 ERC20 代币合约。要求：
// 1. 合约包含以下标准 ERC20 功能：
// 2. balanceOf：查询账户余额。
// 3. transfer：转账。
// 4. approve 和 transferFrom：授权和代扣转账。
// 5. 使用 event 记录转账和授权操作。
// 6. 提供 mint 函数，允许合约所有者增发代币。
// 提示：
// - 使用 mapping 存储账户余额和授权信息。
// - 使用 event 定义 Transfer 和 Approval 事件。
// - 部署到sepolia 测试网，导入到自己的钱包:
//   0x6b7fA1d49C4aA2079c62e1c52cB7BF86aD91959F
//   认证api的时候，注意evm的版本和编译器的版本一致

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title 简单的 ERC20 代币
/// @notice 实现了基本的 ERC20 功能，并包含增发功能
contract SimpleERC20 {
    // 代币基本信息
    string public name = "Antony's Simple ERC20";
    string public symbol = "AntonyC";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // 账户余额映射
    mapping(address => uint256) private _balances;
    // 授权额度映射
    mapping(address => mapping(address => uint256)) private _allowances;

    // 合约所有者
    address public owner;

    // 事件：转账
    event Transfer(address indexed from, address indexed to, uint256 value);
    // 事件：授权
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    // ==================== 基本 ERC20 功能 ====================

    /// @notice 查询账户余额
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /// @notice 转账
    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice 授权
    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice 查询授权额度
    function allowance(
        address _owner,
        address spender
    ) public view returns (uint256) {
        return _allowances[_owner][spender];
    }

    /// @notice 代扣转账
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );

        _allowances[from][msg.sender] = currentAllowance - amount;
        _transfer(from, to, amount);
        return true;
    }

    // ==================== 代币增发功能 ====================

    /// @notice 增发代币（仅限 owner）
    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }

    // ==================== 内部函数 ====================

    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "ERC20: transfer to zero address");
        require(
            _balances[from] >= amount,
            "ERC20: transfer amount exceeds balance"
        );

        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "ERC20: mint to zero address");

        totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
