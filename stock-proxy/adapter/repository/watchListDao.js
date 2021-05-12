const userDao = require("./userDao.js");

function saveWatchList(user, watchList) {
    let userEntity = userDao.getUser(user.username);
    if (userEntity === null || watchList === null) {
        return false;
    }
    userEntity.watchList = watchList;
    userDao.updateUserAccount(userEntity);
    return true;
}

function addStock(user, watchStock) {
    let userEntity = userDao.getUser(user.username);
    if (userEntity === null) {
        throw `user ${user.name} does not exists`;
    }
    userEntity.watchList.push(watchStock);
    userDao.updateUserAccount(userEntity);
}

function removeStock(user, symbol) {
    let userEntity = userDao.getUser(user.username);
    let watchList = userEntity.watchList;
    watchList = watchList.filter((item) => item.name.toUpperCase() !== symbol.toUpperCase());
    userEntity.watchList = watchList;
    userDao.updateUserAccount(userEntity);
}

function getWatchList(user) {
    return userDao.getUser(user.username).watchList;
}

module.exports = {
    saveWatchList,
    addStock,
    removeStock,
    getWatchList
}