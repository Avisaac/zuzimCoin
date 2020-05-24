const { Node } = require("./node");
const { Transaction } = require('./blockchain');
const { BloomFilter } = require('bloom-filters');
const { MerkleTree } = require('./merkletree');
const { P2p } = require('./p2p');
const topology = require('fully-connected-topology');

class Wallet extends Node {
    constructor(srcPort,destPort) {
        super();
        this.transactions = [];
        this.bereshitTransaction();
        this.connection = new P2p(srcPort, destPort);
        this.fullNodes = this.DNS.getFullNodes();
        this.bloomFilter = new BloomFilter(10,4);
        this.bloomFilter.add(this.address);
    }

    init() {
        this.connection.topology = topology(this.connection.selfIp, this.connection.peerIps).
            on('connection', (fullNode,peer) => {
            this.sendBloomFilter(fullNode);
            fullNode.on('data',data => {
                console.log(data);
            })
        });



    }

    sendBloomFilter(fullNode){
        let filterJson = this.bloomFilter.saveAsJSON();
        fullNode.write(JSON.stringify(filterJson));
    }

    sendZuzim(toAddress, amount) {
        const t = new Transaction(this.address, toAddress, amount)
        t.signTransaction(this.key);
        this.transactions.push(t.calculateHash());
        this.mActions.writeTransaction(t);
    }

    verify(transactionHash, merklePathTransactions) {
        let merkleTree = new MerkleTree(merklePathTransactions);
        if(merkleTree.root() === merklePathTransactions.root){
            console.log(`transaction ${transactionHash} is verified`);
            return true;
        } else {
            console.log(`transaction ${transactionHash} is NOT verified`);
            return false;
        }
    }


} 

module.exports.Wallet = Wallet;