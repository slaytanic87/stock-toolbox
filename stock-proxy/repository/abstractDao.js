const fs = require("fs");

let path = "./";

function setPath(pathStr) {
    path = pathStr;
}

function save(dbName, data) {
    fs.writeFile(`${path}${dbName}.json`, JSON.stringify(data, null, 4), (error) => {
        if (error) {
            console.error(error);
            throw Error(error.message)
        }
    });
}

function open(dbName) {
    let data = fs.readFileSync(`${path}${dbName}.json`, "utf-8");
    return JSON.parse(data);
}

module.exports = {
    save,
    open,
    setPath
}