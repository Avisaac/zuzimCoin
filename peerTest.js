const { MerkleTree } = require('./merkletree.js');

const tree = new MerkleTree( ['1', '3', '2', '4'])
const proof = tree.transactionProof('2');

console.log(tree.leaves[3] === proof[0][0])