const abstractDao = require("./abstractDao.js");

const USER_DB_NAME = "users";


function createUser(username, hashedPassword) {
    let usersArray = abstractDao.open(USER_DB_NAME);

    usersArray.forEach((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
            throw `user ${username} already exists`;
        }
    });

    const newUser = {
        username: username.toLowerCase(),
        password: hashedPassword,
        watchList: [],
        newsScraper: [],
        indexList: []
    }

    usersArray.push(newUser);
    abstractDao.save(USER_DB_NAME, usersArray);

    return newUser;
}

function getUser(username) {
    let users = abstractDao.open(USER_DB_NAME);
    let userObj = null;

    users.forEach((user) => {
        if (user.username.toLowerCase() === username.toLowerCase()) {
            userObj = user;
        }
    });
    if (userObj === null) {
        throw `user ${username} does not exists`;
    }
    return userObj;
}

function mapUser(userOld, userNew) {
    let updatedUser = {}
    updatedUser.username = userNew.username !== undefined ? userNew.username : userOld.username;
    updatedUser.password = userNew.password !== undefined ? userNew.password : userOld.password;
    updatedUser.watchList = userNew.watchList !== undefined ? userNew.watchList : userOld.watchList;
    updatedUser.newsScraper = userNew.newsScraper !== undefined ? userNew.newsScraper : userOld.newsScraper;
    updatedUser.indexList = userNew.indexList !== undefined ? userNew.indexList : userOld.indexList;
    return updatedUser;
}

function updateUserAccount(updatedUser) {
    let users = abstractDao.open(USER_DB_NAME);
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (user.username.toLowerCase() === updatedUser.username.toLowerCase()) {
            users[i] = mapUser(users[i], updatedUser);
            abstractDao.save(USER_DB_NAME, users);
            return users[i];
        }
    }

    throw `user ${updatedUser.username} does not exists`;
}

module.exports = {
    createUser,
    getUser,
    updateUserAccount
}