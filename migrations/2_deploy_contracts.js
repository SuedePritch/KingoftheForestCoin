const KingOfTheForestCoin = artifacts.require("./KingOfTheForestCoin.sol");
const KotfSale = artifacts.require("./KotfSale.sol");

module.exports = function (deployer) {
  deployer.deploy(KingOfTheForestCoin, 1000000).then(function(){
    var tokenPrice = 1000000000000000;
    return deployer.deploy(KotfSale, KingOfTheForestCoin.address, tokenPrice);
  
  }).then(function() {
    var tokensAvailable = 800000;
    KingOfTheForestCoin.deployed().then(function(instance) { instance.transfer(KotfSale.address, tokensAvailable, { from: admin }); })
});

};

