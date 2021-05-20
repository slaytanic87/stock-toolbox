const quotes = require("../quotes.json");

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomQuote() {
    let size = quotes.length;
    let randomIndex = randomNumber(0, size - 1);
    return quotes[randomIndex];
}

module.exports = {
    getRandomQuote
}