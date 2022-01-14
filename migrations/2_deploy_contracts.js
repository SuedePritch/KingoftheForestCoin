const KingOfTheForestCoin = artifacts.require("./KingOfTheForestCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(KingOfTheForestCoin, 100);
};

