const yahoo = require("../adapter/yahoo");

let indexlist = require("../indexlist.json");

function getIndexList() {
    return new Promise((resolve, reject) => {
        let result = [];
        let promises = [];
        indexlist.forEach((item) => {
            promises.push(new Promise((res, rej) => {
                yahoo.indices.fetchIndex(item.symbol, "2m", "1d").then((response) => {
                    let indexItem = yahoo.indices.createIndexItem(response.data, item);
                    result.push(indexItem);
                    res();
                }).catch((err) => {
                    console.log(err);
                    rej(err);
                })
            }));
        });
        Promise.allSettled(promises).then((results) => {
            resolve(result);
        });
    });
}

function getMarketIndex(sym) {
    return new Promise((resolve, reject) => {
        yahoo.indices.fetchIndex(sym, "2m", "1d").then((response) => {
            let indexItem = yahoo.indices.createSingleIndexItem(response.data);
            resolve(indexItem);
        }).catch((err) => {
            console.log(err);
            reject(err);
        })
    })
}

module.exports = {
    getIndexList,
    getMarketIndex
}