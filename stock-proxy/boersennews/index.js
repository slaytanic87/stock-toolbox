const calendar = require("./calendar.js");
const scraper = require("../lib/scraper.js");
let articles = require("./news.json");


function fetchNews(res) {
    let promises = [];
    let parsed = [];
    articles.forEach((article)=> {
        promises.push(scraper.scrape(article));
    });

    Promise.allSettled(promises).then((results) => {
        results.forEach((newsList) => {
            parsed = parsed.concat(newsList.value);
        });
        res.json(parsed);
        res.end();
    });
}



module.exports = {
    fetchNews,
    fetchCalendar: calendar.fetchCalendar
}
