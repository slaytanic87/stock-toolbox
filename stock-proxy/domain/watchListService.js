const stockDataService = require("./stockDataService.js");
const watchListDao = require("../repository/watchListDao.js");
const accountService = require("./accountService.js");


function deleteStock(watchStock, user) {
    try {
        let userEntity = accountService.validateUser(user.username, user.password);
        watchListDao.removeStock(userEntity, watchStock.sym);
    } catch (exception) {
        throw exception;
    }
}

function insertStock(watchStock, user) {
    try {
        let userEntity = accountService.validateUser(user.username, user.password);
        watchListDao.addStock(userEntity, watchStock);
    } catch (exception) {
        throw exception;
    }
}

/**
 * Get mapped watchlist items for watchlist dashboard table.
 * @param user user entity
 * @returns {Promise<Object>}
 */
function fetchUiWatchList(user) {
    let userEntity = accountService.validateUser(user.username, user.password);
    return new Promise((resolve, reject) => {
        let result = [];
        let promises = [];

        userEntity.watchList.forEach((item) => {
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
        }).catch((error) => {
            reject(error);
        });
    });
}


function fetchTagsFromWatchList(user) {
    let userEntity = accountService.validateUser(user.username, user.password);
    let tags = [];
    userEntity.watchList.forEach((item) => {
        tags = tags.concat(item.tags)
    });
    return tags;
}

module.exports = {
    deleteStock,
    insertStock,
    fetchUiWatchList,
    fetchTagsFromWatchList
}