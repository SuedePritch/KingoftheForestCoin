var KingOfTheForestCoin = artifacts.require("./KingOfTheForestCoin.sol");

contract ('KingOfTheForestCoin', function(accounts){

    it('initializes contract with correct values', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, 'KingOfTheForestCoin', 'has correct name');
            return tokenInstance.symbol(); 
        }).then(function(symbol){
            assert.equal(symbol, "KOTF", 'has correct symbol');  
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, "KOTF Coin v1.0", 'has correct standard');
        })
    })



    it('sets the total supply upon deployment', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 100000, 'set supply to 100000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 100000, 'it allocates initial supply to admin account');

        });
    });
})