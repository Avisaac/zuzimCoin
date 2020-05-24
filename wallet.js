const { Node } = require("./node");
const { Transaction } = require('./blockchain');
const { BloomFilter } = require('bloom-filters');
const { MerkleTree } = require('./merkletree');
const { stdin, exit, argv } = process;
const { P2p } = require('./p2p');
const topology = require('fully-connected-topology');

class Wallet extends Node {
    constructor(srcPort,destPort) {
        super();
        this.transactions = [];
        this.bereshitTransaction('wallet');
        this.connection = new P2p(srcPort, destPort);
        this.bloomFilter = new BloomFilter(10,4);
        this.bloomFilter.add(this.address);
        this.options = [
            "1.Send zuzim: address amount",
            "2.Verify: transactionId"
        ]
    }

    init() {
        this.connection.topology = topology(this.connection.selfIp, this.connection.peerIps).
            on('connection', (fullNode,peer) => {
            this.sendBloomFilter(fullNode);
            this.printMain();

            stdin.on('data',data => {
                let args = data.toString().trim().split(' ');
                if(args[0] === '1'){
                    this.sendZuzim(args[1],args[2]);
                } else if(args[0] === '2'){
                    // verify
                }
            })

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