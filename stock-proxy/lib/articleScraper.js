const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

async function scrapeCSR(articleScrapeRule) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(articleScrapeRule.url);
    const data = await page.content();
    await browser.close();
    const dom = cheerio.load(data);
    return parseArticle(dom, articleScrapeRule);
}

function scrapeSSR(articleScrapeRule) {
    return new Promise((resolve, reject) => {
        axios.get(articleScrapeRule.url).then((resp) => {
            const dom = cheerio.load(resp.data);
            let newsList = parseArticle(dom, articleScrapeRule);
            resolve(newsList);
        }).catch((error)=> {
            console.error(error);
            reject(error);
        });
    });
}

function parseArticle(dom, articleScrapeRule) {
    let articleRows = dom(articleScrapeRule.query);
    let newsList = [];

    articleRows.each((index, elem) => {
        let title = dom(elem).find(articleScrapeRule.row.title.query);
        let main = dom(elem).find(articleScrapeRule.row.main.query);
        let imgUrl = "";
        if (articleScrapeRule.row.image.query !== "" && articleScrapeRule.row.image.query !== null) {
            let image = dom(elem).find(articleScrapeRule.row.image.query);

            if (articleScrapeRule.row.image.attr !== "" && image.attr(articleScrapeRule.row.image.attr) !== undefined) {
                imgUrl = image.attr()[articleScrapeRule.row.image.attr];
            } else {
                imgUrl = image.text();
            }
        }
        let hrefPath = articleScrapeRule.row.link.query === "" ? elem.attribs[articleScrapeRule.row.link.attr]:
            dom(elem).find(articleScrapeRule.row.link.query).attr()[articleScrapeRule.row.link.attr];

        if (title.text() === "" || main.text() === "") {
            return;
        }
        newsList.push({
            origin: articleScrapeRule.name,
            href: articleScrapeRule.row.link.baseUrl + hrefPath,
            title: title.text(),
            main: main.text(),
            category: articleScrapeRule.category,
            image: articleScrapeRule.row.image.baseUrl + imgUrl
        });
    });
    return newsList;
}

module.exports = {
    scrapeSSR,
    scrapeCSR
}
