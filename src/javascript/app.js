
App = {
    loading:false,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold:0,
    tokensAvailable:800000,
    load:async ()=>{
        //Load App
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        web3.eth.defaultAccount = web3.eth.accounts[0]
    },
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
            } catch (error) {
            // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () =>{
        App.account = web3.eth.accounts[0]
    },
    loadContract: async () =>{
        const  KingOfTheForestCoin= await $.getJSON('KingOfTheForestCoin.json')
        App.contracts.KingOfTheForestCoin = TruffleContract(KingOfTheForestCoin)
        App.contracts.KingOfTheForestCoin.setProvider(App.web3Provider)
        App.KingOfTheForestCoin = await App.contracts.KingOfTheForestCoin.deployed()
        .then(function(KingOfTheForestCoin){

            console.log("King of the Forest Coin address:", KingOfTheForestCoin.address);
        }) 
        const  KotfSale= await $.getJSON('KotfSale.json')
        App.contracts.KotfSale = TruffleContract(KotfSale)
        App.contracts.KotfSale.setProvider(App.web3Provider)
        App.KotfSale = await App.contracts.KotfSale.deployed().then(function(KotfSale){

            console.log("King of the Forest Sale address:", KotfSale.address);
        });
        return App.render(); 
        
    },
    render: async () =>{
        if (App.loading){
            return
        }
        App.setLoading(true)

        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }})

            //load token sale contract
        await App.contracts.KotfSale.deployed().then(function(instance){
            KotfSaleInstance = instance;
            return KotfSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.utils.fromWei(App.tokenPrice, "ether"));
            return KotfSaleInstance.tokensSold();
        }).then(function(tokensSold){
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (App.tokensSold / App.tokensAvailable) *100;
            $('#progress').css('width', progressPercent +'%');

        });
        //load token contract
        await App.contracts.KingOfTheForestCoin.deployed().then(function(instance) {
            CoinInstance = instance;
            return CoinInstance.balanceOf(App.account);
        }).then(function(balance) {
            $('.kotf-balance').html(balance.toNumber());
            
            App.setLoading(false)
        });
        },

    buyTokens: function(){
        $('#content').hide();
        $('#loader').show();

        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.KotfSale.deployed().then(function(instance){
            KotfSaleInstance = instance;
            return KotfSaleInstance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 5000000
            });
        }).then(function(result){
            console.log("tokens purchased")
            $('form').trigger('reset');
            $('#loader').hide();
            $('#content').show();

        })
    },    
    



    
    setLoading:(boolean) =>{
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean){
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

        //load price
        
        //current balance

        //load account number to browser


window.addEventListener('load', async () => {
    try {
        await ethereum.enable();
    } catch (error) {}
    });



window.onload = function(){
    App.load();
}