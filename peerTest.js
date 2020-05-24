const {MemPoolActions} = require('./mem_pool_actions');
const { Transaction } = require('./blockchain');
let memPoolActions = new MemPoolActions();
memPoolActions.clear();
memPoolActions.writeTransaction(new Transaction("a","s","1"),"test");
memPoolActions.writeTransaction(new Transaction("a","s","1"),"test");
memPoolActions.readTransaction();