const {Node} = require("./node");
const { BloomFilter } = require('bloom-filters');
const { Blockchain } = require('./blockchain');
const topology = require('fully-connected-topology');

class FullNode extends Node{
    constructor() {
        super();
        this.blockchain = new Blockchain();
        this.bereshitTransaction();
        this.bloomFilters = [];
        this.peers = {};
    }

    init(){
        topology("127.0.0.1:4000",["127.0.0.1:4001"])
            .on('connection',(socket,peer) => {
                console.log(`peer connected: ${peer} \n`)
                this.peers[peer] = socket;

                socket.on('data',data => this.receiveBloomFilter(peer,data))

                stdin.on('data',data => {
                    let args = data.toString().split(' ');
                    if(args[0] === '1'){
                        this.mine()
                    }
                })
            })
    }

    mine() {
        // Add check if there exactly 4 transactions
        let transactions = this.mActions.readTransactions();
        if(transactions.size !== 4){
            console.log("Not enough transactions to start mining")
        }
        this.blockchain.minePendingTransactions(this.address);
        let latestBlock = this.blockchain.getLatestBlock();

        this.filterBloomFilters(transactions,latestBlock);
        this.mActions.clear();
    }

    receiveBloomFilter(peer,bloomFilter){
        this.bloomFilters.push({'peer':peer,'bloomFilter':BloomFilter.fromJSON(JSON.parse(bloomFilter.toString()))});
    }

    filterBloomFilters(transactions,latestBlock) {
        for(const filter of this.bloomFilters){
            for(const tx of transactions){
                if(filter.bloom.has(tx)){
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