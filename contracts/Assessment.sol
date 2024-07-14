// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public investmentBalance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event InvestmentAdded(uint256 amount);
    event InvestmentWithdrawn(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        uint _previousBalance = balance;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function addInvestment(uint256 _amount) public payable onlyOwner {
        uint _previousInvestmentBalance = investmentBalance;

        // perform transaction
        investmentBalance += _amount;

        // assert transaction completed successfully
        assert(investmentBalance == _previousInvestmentBalance + _amount);

        // emit the event
        emit InvestmentAdded(_amount);
    }

    function withdrawInvestment(uint256 _withdrawAmount) public onlyOwner {
        uint _previousInvestmentBalance = investmentBalance;
        if (investmentBalance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: investmentBalance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        investmentBalance -= _withdrawAmount;

        // assert the balance is correct
        assert(investmentBalance == (_previousInvestmentBalance - _withdrawAmount));

        // emit the event
        emit InvestmentWithdrawn(_withdrawAmount);
    }
}
