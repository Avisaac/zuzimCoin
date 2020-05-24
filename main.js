const {Wallet} = require('./wallet');
const {Node} = require('./node.js');
const { stdin, exit, argv } = process;

const params = {
    isNode: argv[2] === 'node',
    selfPort: argv[3],
    peers: argv.slice(4, argv.length)
};

let current;
if (params.isNode) {
    current = new Node(params.selfPort, params.peers);
} else if (!params.isNode) {
    current = new Wallet(params.selfPort, params.peers);
}

current.init();

console.log('Wired up');
// create full node
// create wallet and full node main
// wallet main
    // 1.send zuzim
    // 2. verify
//full node
    // 1.mine