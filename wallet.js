const {MemPoolActions} = require('./mem_pool_actions');
const {Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Wallet {
    constructor() {
        const keyPair = ec.genKeyPair(); 
        this.key = ec.keyFromPrivate(keyPair.getPrivate());
        this.address = keyPair.getPublic('hex');
        this.transactions = [];

        console.log('created');
        this.mActions = new MemPoolActions();
        this.bereshitTransaction();
    }

    bereshitTransaction() {
        this.mActions.writeTransaction(new Transaction(null, this.address, 1000)); 
    }

    sendZuzim(toAddress, amount) {
        const t = new Transaction(this.address, toAddress, amount)
        t.signTransaction(this.key);
        this.transactions.push(t.calculateHash());
        this.mActions.writeTransaction(t);
    }

    verify(transactionHash, reuslts) {

    }


} 

module.exports.Wallet = Wallet;