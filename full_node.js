const {Node} = require("./node");
const Peer = require('simple-peer')
const wrtc = require('wrtc')
const { BloomFilter } = require('bloom-filters');
const topology = require('fully-connected-topology');

class fullNode extends Node{
    constructor() {
        super();
        this.blockchain = new Blockchain();
        this.bereshitTransaction();
        this.DNS.registerFullNode(this.peer);
        this.bloomFilters = [];
        this.peers = {};
    }

    initPeer(){
        topology("127.0.0.1:4500",["127.0.0.1:4501"])
            .on('connection',(socket,peer) => {
                console.log(`peer connected: ${peer} \n`)
                this.peers[peer] = socket;

                socket.on('data',data => this.receiveBloomFilter(peer,data))
            })
    }

    mine() {
        let transactions = this.mActions.readTransactions();
        this.blockchain.minePendingTransactions(this.address);
        let latestBlock = this.blockchain.getLatestBlock();

        this.filterBloomFilters(transactions,latestBlock);
        this.mActions.clear();
    }

    receiveBloomFilter(peer,bloomFilter){
        this.bloomFilters.push({'peer':peer,'bloomFilter':BloomFilter.fromJSON(bloomFilter)});
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