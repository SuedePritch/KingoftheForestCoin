// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
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
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender,_numberOfTokens);


    }


    //Ending Token Sale
    function endSale() public{
        //only admin can end sale
        require(msg.sender == admin);
        //transfer the remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        
        payable(admin).transfer(address(this).balance);
    }
}