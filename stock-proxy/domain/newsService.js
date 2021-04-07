const scraper = require("../lib/scraper.js");
let articles = require("../news.json");

function getNews() {
    return new Promise((resolve, reject) => {
        let promises = [];
        let parsed = [];
        articles.forEach((article) => {
            if (article.renderingType === "client".toLowerCase()) {
                promises.push(scraper.scrapeCSR(article));
                return;
            }
            promises.push(scraper.scrape(article));
        });

        Promise.allSettled(promises).then((results) => {
            results.forEach((newsList) => {
                parsed = parsed.concat(newsList.value);
            });
            resolve(parsed);
        });
    });
}

module.exports = {
    getNews
}