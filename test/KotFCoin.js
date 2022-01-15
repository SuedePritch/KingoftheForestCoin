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
        });
    });



    it('sets the total supply upon deployment', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 100, 'set supply to 100000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 100, 'it allocates initial supply to admin account');

        });
    });

    it('transfers token ownership', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            //send more tokens than senders balance
            return tokenInstance.transfer.call(accounts[1], 9999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 25, {from: accounts[0]});

        }).then(function(success){
                assert.equal(success, true, 'returns true');
                return tokenInstance.transfer(accounts[1], 25, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 25, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 25, 'adds amount to recieving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 75, 'deducts the amount from sender account');
        });
    });



    it('approves token for delegated transfer', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 5);
        }).then(function(success){
            assert.equal(success, true, 'returns true');
            return tokenInstance.approve(accounts[1], 10, {from: accounts[0]});  
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized from');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 10, 'stores allowance for delegated transfer');
        });
    })


    it('handles delegated transfers', function(){
        return KingOfTheForestCoin.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            //transfer some tokens to base account
            return tokenInstance.transfer(fromAccount, 20, {from:accounts[0]}); 
        }).then(function(receipt){
            //Approve spendingAccount to spend 2 fromAccount
            return tokenInstance.approve(spendingAccount, 2, {from:fromAccount});

        }).then(function(receipt){
            //Try transfering something larger than senders balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 999999, {from:spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'cannot transfer value larger than balance');
            //try to transfer larger than approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >=0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 2, {from:spendingAccount})
        }).then(function(success){
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 2, {from: spendingAccount})
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value, 2, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 18, 'deducts amount from second account' );
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 2, 'adds amount from recieving account' );
            return tokenInstance.allowance(fromAccount, spendingAccount); 
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'deducts from allowance')
        });
    });

});