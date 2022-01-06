const tokens = require("../apiTokens.json");

function getAlphavantageToken() {
    return tokens.alphavantage;
}

module.exports = {
    getAlphavantageToken
}
