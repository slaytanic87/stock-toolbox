const fs = require("fs");

let path = "./";

function setPath(pathStr) {
    path = pathStr;
}

function save(profileName, data) {
    fs.writeFile(`${path}${profileName}.json`, JSON.stringify(data, null, 4), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

function open(profileName) {
    let data = fs.readFileSync(`${path}${profileName}.json`, "utf-8");
    return JSON.parse(data);
}

module.exports = {
    save,
    open,
    setPath
}