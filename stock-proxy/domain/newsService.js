const articleScraper = require("../lib/articleScraper.js");
const accountService = require("./accountService.js");

function fetchNews(user) {
    let userEntity = accountService.validateUser(user.username, user.password);
    return new Promise((resolve, reject) => {
        let promises = [];
        let parsed = [];
        userEntity.newsScraperRules.forEach((article) => {
            if (article.renderingType === "client".toLowerCase()) {
                promises.push(articleScraper.scrapeCSR(article));
                return;
            }
            promises.push(articleScraper.scrapeSSR(article));
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
    fetchNews
}