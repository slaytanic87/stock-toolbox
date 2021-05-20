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

function addUser(username, password) {
    try {
        const hashedPassword = getCrypto().createHash("sha256").update(password).digest("hex");
        return userDao.createUser(username, hashedPassword);
    } catch (exception) {
        return {
            error: exception
        }
    }
}

function authenticate(username, password) {
    const hashedPassword = getCrypto().createHash("sha256").update(password).digest("hex");
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

function updateAccount(userEntity) {
    try {
        validateUser(userEntity.username, userEntity.password);
        return userDao.updateUserAccount(userEntity);
    } catch (exception) {
        return {
            error: exception
        }
    }
}

module.exports = {
    addUser,
    getUser,
    updateAccount,
    validateUser,
    authenticate
}