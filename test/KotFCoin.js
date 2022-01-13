var KingOfTheForestCoin = artifacts.require("./KingOfTheForestCoin.sol");

contract ('KingOfTheForestCoin', function(accounts){
    it('sets the total supply upon deployment', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 100000, 'set supply to 100000')
        })
    });
})