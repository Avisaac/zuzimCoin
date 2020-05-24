const {Wallet} = require('./wallet');
const {FullNode} = require('./full_node.js');
const { stdin, exit, argv } = process;
const {MemPoolActions} = require('./mem_pool_actions');
const mActions = new MemPoolActions();

const params = {
    isNode: argv[2] === 'node',
    selfPort: argv[3],
    peers: argv.slice(4, argv.length)
};

let current;
if (params.isNode) {
    mActions.clear();
    current = new FullNode(params.selfPort, params.peers);
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