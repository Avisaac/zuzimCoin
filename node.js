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

    printMain(options){
        console.log("<-----options----->");
        options.forEach(console.log)
    }
}

module.exports.Node = Node;
