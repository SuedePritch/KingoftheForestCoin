// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract KingOfTheForestCoin{
    string public name = 'KingOfTheForestCoin';
    string public symbol = "KOTF";
    string public standard = "KOTF Coin v1.0";
    uint256 public totalSupply;


    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


    mapping(address => uint256) public balanceOf;
    mapping(address=> mapping(address=>uint256)) public allowance;

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
    //approve
    function approve(address _spender, uint256 _value) public returns(bool success){
        //allowance
        allowance[msg.sender][_spender]= _value;

        //Approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }
    //transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender]-= _value;


        emit Transfer(_from, _to, _value);
        
        return true;
    }
}
