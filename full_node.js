const {Node} = require("./node");
const { BloomFilter } = require('bloom-filters');
const { Blockchain } = require('./blockchain');
const { stdin, exit, argv } = process;
const topology = require('fully-connected-topology');

class FullNode extends Node{
    constructor() {
        super();
        this.blockchain = new Blockchain();
        this.bereshitTransaction('full_node');
        this.bloomFilters = [];
        this.peers = {};
        this.options = [
            '1.mine'
        ]
    }

    init(){
        topology("127.0.0.1:4000",["127.0.0.1:4001"])
            .on('connection',(socket,peer) => {
                console.log(`peer connected: ${peer} \n`)
                this.peers[peer] = socket;
                this.printMain()
                socket.on('data',data => this.receiveBloomFilter(peer,data))

                stdin.on('data',data => {
                    let args = data.toString().trim().split(' ');
                    if(args[0] === '1'){
                        this.mine()
                    }
                })
            })
    }

    mine() {
        let transactions = this.mActions.readTransaction();
        if(transactions.length !== 3){
            console.log("Not enough transactions to start mining")
            return;
        }
        for(const transaction of transactions){
            this.blockchain.pendingTransactions.push(transaction);
        }
        this.blockchain.minePendingTransactions(this.address);
        let latestBlock = this.blockchain.getLatestBlock();

        this.filterBloomFilters(transactions,latestBlock);
        this.mActions.clear();
    }

    receiveBloomFilter(peer,bloomFilter){
        let bloomFilter1 = BloomFilter.fromJSON(JSON.parse(bloomFilter.toString()));
        this.bloomFilters.push({'peer':peer,'bloomFilter': bloomFilter1});
    }

    filterBloomFilters(transactions,latestBlock) {
        for(const filter of this.bloomFilters){
            for(const tx of transactions){
                if(filter.bloomFilter.has(tx.toAddress)){
                    let socket = this.peers[filter.peer];
                    let proof = latestBlock.merkleTree.transactionProof(tx);
                    socket.write(JSON.stringify(proof))

                }
            }

        }
    }

    sendData(transaction,peer){

    }

}

module.exports.FullNode = FullNode  ;