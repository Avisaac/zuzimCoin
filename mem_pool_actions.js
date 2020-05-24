const fs = require('fs');

class MemPoolActions {
    writeTransaction(transaction, type) {
        console.log(`Writing data for ${type}..`);
        let memData = this.readTransaction();
        if (memData) {
            console.log(memData.toString());
            memData.push(transaction);
        } else {
            memData = [transaction];
        }
        fs.writeFileSync('./mem_pool.json', JSON.stringify(memData));
        console.log('Done writing.');
    }

    readTransaction() {
        let text = fs.readFileSync('./mem_pool.json');
        return JSON.parse(text.toString());
    }

    clear() {
        fs.writeFileSync('./mem_pool.json', '[]');
    }
}

module.exports.MemPoolActions = MemPoolActions;