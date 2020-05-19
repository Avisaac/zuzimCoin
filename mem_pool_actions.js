var fs = require('fs');

class MemPoolActions {
    writeTransaction(transaction) {
        console.log('Writing data..');
        const memData = this.readTransaction();
        if (memData) { memData.push(transaction); }
        else { memData = [transaction]; };
        fs.writeFileSync('./mem_pool.json', JSON.stringify(memData));
        console.log('Done writing.');
    }

    readTransaction() {
        let dataObj;
        fs.readFileSync('./mem_pool.json', (data) => {
            if (data) {
                dataObj = JSON.parse(data);
            }
        });

        return dataObj;
    }
}

module.exports.MemPoolActions = MemPoolActions;