App ={
    web3Provider:null,
    contracts: {},

    init: function(){
        console.log("App Initialized");
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            window.ethereum.enable();
        } else {
          // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },
    initContracts:function(){
        $.getJSON("KotfSale.json", function(KotfSale) {
            App.contracts.KotfSale = TruffleContract(KotfSale);
            App.contracts.KotfSale.setProvider(App.web3Provider);
            App.contracts.KotfSale.deployed().then(function(KotfSale) {
            console.log("KotF Sale Address:", KotfSale.address);
            });
        }).done(function() {
            $.getJSON("KingOfTheForestCoin.json", function(KingOfTheForestCoin) {
            App.contracts.KingOfTheForestCoin = TruffleContract(KingOfTheForestCoin);
            App.contracts.KingOfTheForestCoin.setProvider(App.web3Provider);
            App.contracts.KingOfTheForestCoin.deployed().then(function(KingOfTheForestCoin) {
                console.log("King Of The Forest Coin Address:", KingOfTheForestCoin.address);
            });

            App.listenForEvents();
            return App.render();
            });
    }   )
        },
    }

window.onload = function(){
    App.init();
}