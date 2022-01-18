

App = {
    loading:false,
    contracts: {},
    load:async ()=>{
        //Load App
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        // await App.render()
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
        const  KotfSale= await $.getJSON('KotfSale.json')
        App.contracts.KotfSale = TruffleContract(KotfSale)
        App.contracts.KotfSale.setProvider(App.web3Provider)
        App.KotfSale = await App.contracts.KotfSale.deployed()
    }}

window.onload = function(){
    App.load();
}