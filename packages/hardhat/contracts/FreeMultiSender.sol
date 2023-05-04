// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

abstract contract ERC20Basic {
  function totalSupply() public view virtual returns (uint256);

  function balanceOf(address who) public view virtual returns (uint256);

  function transfer(address to, uint256 value) public virtual returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
}

abstract contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view virtual returns (uint256);

  function transferFrom(address from, address to, uint256 value) public virtual returns (bool);

  function approve(address spender, uint256 value) public virtual returns (bool);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract FreeMultiSender {
  mapping(address => uint256) public txCount;
  address public owner;
  uint16 public arrayLimit = 150;

  event Multisended(uint256 total, address tokenAddress);

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function.");
    _;
  }

  constructor(address _owner) {
    owner = _owner;
  }

  receive() external payable {}

  function changeTreshold(uint16 _newLimit) public onlyOwner {
    arrayLimit = _newLimit;
  }

  function multisendToken(address token, address[] memory _contributors, uint256[] memory _balances) public {
    uint256 total = 0;
    require(_contributors.length <= arrayLimit, "Too many contributors in a single transaction.");
    ERC20 erc20token = ERC20(token);
    uint8 i = 0;
    require(erc20token.allowance(msg.sender, address(this)) > 0, "Insufficient token allowance.");
    for (i; i < _contributors.length; i++) {
      erc20token.transferFrom(msg.sender, _contributors[i], _balances[i]);
      total += _balances[i];
    }
    txCount[msg.sender]++;
    emit Multisended(total, token);
  }

  function multisendEther(address[] memory _contributors, uint256[] memory _balances) public payable {
    uint256 total = 0;
    require(_contributors.length <= arrayLimit, "Too many contributors in a single transaction.");
    uint8 i = 0;
    for (i; i < _contributors.length; i++) {
      (bool success, ) = _contributors[i].call{value: _balances[i]}("");
      require(success, "Ether transfer failed.");
      total += _balances[i];
    }
    txCount[msg.sender]++;
    emit Multisended(total, address(0));
  }
}
