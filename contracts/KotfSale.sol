// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./KingOfTheForestCoin.sol";

contract KotfSale {
    address admin;
    KingOfTheForestCoin public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(KingOfTheForestCoin _tokenContract, uint256 _tokenPrice){
        //assign admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Coin Price
        tokenPrice = _tokenPrice;
    
    } 
    //Buy Tokens
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z = x*y)/y ==x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        //require number of tokens * sale price
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        //require that enough tokens in contract to complete sale
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        //require that transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        //how many tokens have been sold
        tokensSold += _numberOfTokens;
        //emit sell event
        emit Sell(msg.sender,_numberOfTokens);


    }
}