const yahoo = require("../adapter/yahoo");
const accountService = require("./accountService.js");

function fetchIndexList(user) {
    let userEntity = accountService.validateUser(user.username, user.password);
    return new Promise((resolve, reject) => {
        let result = [];
        let promises = [];
        userEntity.indexList.forEach((item) => {
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
        })
        Promise.allSettled(promises).then((results) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    })
}

/**
 *
 * @param sym
 * @returns {Promise<unknown>}
 */
function fetchMarketIndexFromApi(sym) {
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
    fetchIndexList,
    fetchMarketIndexFromApi
}
