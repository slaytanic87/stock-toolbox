const stockDataService = require("./stockDataService.js");
let watchlist = require("../watchlist.json");

function removeStock(watchStock) {
    watchlist = watchlist.filter((stock) => stock.name.toUpperCase() !== watchStock.sym.toUpperCase());
}

function addStock(watchStock) {
    watchlist.push(watchStock);
}

function getWatchlist() {
    return new Promise((resolve, reject) => {
        let result = [];
        let promises = [];

        watchlist.forEach((item) => {
            promises.push(new Promise((res, rej) => {
                stockDataService.getWatchItem(item, "1mo").then((response) => {
                    result.push(response);
                    res();
                }).catch((err) => {
                    rej(err);
                });
            }));
        });

        Promise.allSettled(promises).then((results) => {
            resolve(result);
        });
    });
}

function getTagsFromWatchList() {
    let tags = [];
    watchlist.forEach((item) => {
        tags = tags.concat(item.tags);
    });
    return tags;
}

module.exports = {
    removeStock,
    addStock,
    getWatchlist,
    getTagsFromWatchList
}