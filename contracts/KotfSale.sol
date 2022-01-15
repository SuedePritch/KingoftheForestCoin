// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./KingOfTheForestCoin.sol";

contract KotfSale {
    address admin;
    KingOfTheForestCoin public tokenContract;
    uint256 public tokenPrice;
    constructor(KingOfTheForestCoin _tokenContract, uint256 _tokenPrice){
        //assign admin
        admin = msg.sender;

        //Token Contract
        tokenContract = _tokenContract;

        //Coin Price
        tokenPrice = _tokenPrice;
    } 

}