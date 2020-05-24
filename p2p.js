const topology = require('fully-connected-topology')
const { stdin, exit, argv } = process;

class P2p {
    constructor(selfPort, peersPort) {
        this.selfPort = selfPort;
        this.peers = peersPort;
        this.selfIp = `127.0.0.1:${selfPort}`;
        this.peerIps = peersPort.map(peer => `127.0.0.1:${peer}`);
        this.sockets = {};
        this.topology = {};
    }


    getPortFromIp(peer) {
        return peer.toString().slice(peer.length - 4, peer.length);
    }

    connect(wallet) {
        this.topology = topology(this.selfIp, this.peerIps).on('connection', (socket, peerIp) => {
            const peerPort = this.getPortFromIp(peerIp);
            console.log('connected to peer - ', peerPort);

            this.sockets[peerPort] = socket;

            stdin.on('data', data => wallet.onInput(data.toString().trim()));

            //print data when received
            socket.on('data', data => log(data.toString('utf8')));
        })
    }
}

module.exports.P2p = P2p;