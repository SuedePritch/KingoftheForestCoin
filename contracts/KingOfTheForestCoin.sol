// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract KingOfTheForestCoin{
    string public name = 'KingOfTheForestCoin';
    string public symbol = "KOTF";
    string public standard = "KOTF Coin v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );


    constructor(uint256 _initialSupply){
        balanceOf[msg.sender]= _initialSupply;
        totalSupply = _initialSupply;
        }
        //transfer
        function transfer(address _to, uint256 _value) public returns(bool success){
        //transfer exception is account doesnt have enough 
        require(balanceOf[msg.sender] >= _value);
        //transfer the balance from sender to receiver
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        //Transfer Event
        emit Transfer(msg.sender, _to, _value);
        //return boolean
        return true;


        }
    
}
