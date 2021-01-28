const axios = require("axios");
const cheerio = require("cheerio");
const baseUrl = "https://www.boersennews.de";
const topNewsUrl = baseUrl + "/nachrichten/top-news/";
const exclusiveNews = baseUrl + "/nachrichten/id/183/";

function fetchNews(res) {
    let newsList = [];
    let promises = [];
    promises.push(callNews(topNewsUrl, newsList, "TopNews"))
    promises.push(callNews(exclusiveNews, newsList, "Exclusive"))

    Promise.allSettled(promises).then((results) => {
        res.json(newsList);
        res.end();
    });
}


function callNews(url, newsList, category) {
    return new Promise((resolve, reject) => {
        axios.get(url).then((resp) => {
            const dom = cheerio.load(resp.data);
            let rowDivs = dom("div[class=row]").find("div > a")
            rowDivs.each((index, elem) => {
                let p = dom(elem).find("p");
                let title = dom(elem).find("h4");
                if (title.text() === "" || p.text() === "") {
                    return;
                }

                newsList.push({
                    origin: "Börsennews.de",
                    href: baseUrl + elem.attribs["href"],
                    title: title.text(),
                    main: p.text(),
                    category: category
                })
                resolve();
            });
        }).catch((error) => {
            console.log(error.response);
            reject(error);
        });
    });
}


module.exports = {
    fetchNews
}
