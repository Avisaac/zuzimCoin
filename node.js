const {MemPoolActions} = require('./mem_pool_actions');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {DNS} = require("./DNS");
const { Transaction } = require('./blockchain');

class Node {
    constructor() {
        const keyPair = ec.genKeyPair();
        this.key = ec.keyFromPrivate(keyPair.getPrivate());
        this.address = keyPair.getPublic('hex');
        this.mActions = new MemPoolActions();
        this.DNS = new DNS();
    }

    init() {

    }

    bereshitTransaction() {
        const t = new Transaction(null, this.address, 1000);
        this.mActions.writeTransaction(t);
    }

    mine() {
        // let transactions = [];
        // let transactionsData = this.mActions.readTransaction();
        //
        // for (const tx of transactionsData) {
        //     transactions.push(Object.assign(new Transaction, tx));
        // }
        //
        // this.blockChain.minePendingTransactions(this.address, transactions.slice(0, 3));
        //
        // writeToMemPool(transactions.slice(3, transactions.length));
    }
}

module.exports.Node = Node;
