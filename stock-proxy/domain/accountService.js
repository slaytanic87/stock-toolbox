const userDao = require("../adapter/repository/userDao.js");

function getCrypto() {
    let crypto;
    try {
        crypto = require("crypto");
        return crypto;
    } catch (error) {
        console.error("crypto support is disabled: " + error);
        throw error;
    }
}

function getHashedPassword(password) {
    return getCrypto().createHash("sha256").update(password).digest("hex");
}

function addUser(username, password) {
    try {
        const hashedPassword = getHashedPassword(password);
        return userDao.createUser(username, hashedPassword);
    } catch (exception) {
        return {
            error: exception
        }
    }
}

function authenticate(username, password) {
    const hashedPassword = getHashedPassword(password);
    let validatedUser = validateUser(username, hashedPassword);
    return {
        username: validatedUser.username,
        password: validatedUser.password
    }
}

function validateUser(username, hashedPassword) {
    let user = userDao.getUser(username);
    if (hashedPassword === user.password) {
        return user;
    }
    throw `wrong password for user ${username}`
}

function getUser(username, password) {
    try {
        return validateUser(username, password);
    } catch (exception) {
        return {
            error: exception
        }
    }
}

function getObservedStock(username, password, symbol) {
    try {
        let validatedUser = validateUser(username, password);
        let watchList = validatedUser.watchList;
        return watchList.find((stock) => stock.name === symbol)
    } catch (exception) {
        throw exception;
    }
}

function updateObservedStock(username, password, stock) {
    try {
        let validatedUser = validateUser(username, password);
        let index = validatedUser.watchList.findIndex((currentStock) => stock.name === currentStock.name);
        validatedUser.watchList[index] = stock;
        userDao.updateUserAccount(validatedUser);
    } catch (exception) {
        throw exception;
    }
}

function updateAccount(userEntity) {
    try {
        validateUser(userEntity.username, userEntity.password);
        return userDao.updateUserAccount(userEntity);
    } catch (exception) {
        throw exception;
    }
}

function changePassword(userEntity, newPassword) {
    try {
        let oldPassword = getHashedPassword(userEntity.password);
        let user = validateUser(userEntity.username, oldPassword);
        user.password = getHashedPassword(newPassword);
        return updateAccount(user);
    } catch (e) {
        throw e;
    }
}

module.exports = {
    addUser,
    getUser,
    updateAccount,
    changePassword,
    validateUser,
    authenticate,
    getObservedStock,
    updateObservedStock
}