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
        let dataObj;
        fs.readFileSync('./mem_pool.json', (err, data) => {
            if (err) {
                console.error(err.toString());
            }
            if (data) {
                dataObj = JSON.parse(data);
            }
        });

        return dataObj;
    }

    clear() {
        fs.writeFileSync('./mem_pool.json', '');
    }
}

module.exports.MemPoolActions = MemPoolActions;