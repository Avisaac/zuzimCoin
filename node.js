const {MemPoolActions} = require('./mem_pool_actions');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Transaction } = require('./blockchain');

class Node {
    constructor() {
        const keyPair = ec.genKeyPair();
        this.key = ec.keyFromPrivate(keyPair.getPrivate());
        this.address = keyPair.getPublic('hex');
        this.mActions = new MemPoolActions();
        this.options = [
            "1.Mine: ",
            "2.Balance: ",
            "2.Transaction: "
        ]
    }

    init() {

    }

    bereshitTransaction() {
        const t = new Transaction(null, this.address, 1000);
        this.mActions.writeTransaction(t);
    }

    printMain() {
        console.log("<-----options----->");
        this.options.forEach(o => console.log(o))
    }
}

module.exports.Node = Node;
