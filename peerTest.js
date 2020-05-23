const { MerkleTree } = require('./merkletree.js');

let merkleTree = new MerkleTree(['aa','bb','cc','dd']);
let proof = merkleTree.proof(1);
console.log(proof)