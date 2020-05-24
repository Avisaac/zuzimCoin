const { Node } = require("./node");
const { Transaction } = require('./blockchain');
const { BloomFilter } = require('bloom-filters');
const { MerkleTree } = require('./merkletree');
const { P2p } = require('./p2p');
const topology = require('fully-connected-topology');

class Wallet extends Node {
    constructor() {
        super();
        this.transactions = [];
        this.bereshitTransaction();
        this.connection = new P2p(srcPort, dstPorts);
        this.fullNodes = this.DNS.getFullNodes();
        this.bloomFilter = new BloomFilter(10,4);
        this.bloomFilter.add(this.address);
        this.sendBloomFilter();
    }

    init() {
        this.connection.topology = topology(this.connection.selfIp, this.connection.peerIps)


    }

    sendBloomFilter(){
        // send bloom filter
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