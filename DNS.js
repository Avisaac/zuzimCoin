class DNS {
    constructor() {
        this.fullNodes = [];
    }

    registerFullNode(fullNode){
        this.fullNodes.push(fullNode);
    }

    removeFullNode(fullNode){
        //
    }

    getFullNodes(){
        return JSON.stringify(this.fullNodes);
    }
}

module.exports.DNS = DNS;
