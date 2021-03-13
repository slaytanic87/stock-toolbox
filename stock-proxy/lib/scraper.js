const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

async function scrapeCSR(article) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(article.url);
    const data = await page.content();
    await browser.close();
    const dom = cheerio.load(data);
    return parseArticle(dom, article);
}

function scrape(article) {
    return new Promise((resolve, reject) => {
        axios.get(article.url).then((resp) => {
            const dom = cheerio.load(resp.data);
            let newsList = parseArticle(dom, article);
            resolve(newsList);
        }).catch((error)=> {
            console.log(error);
            reject(error);
        });
    });
}

function parseArticle(dom, article) {
    let articleRows = dom(article.query);
    let newsList = [];
    articleRows.each((index, elem) => {
        let title = dom(elem).find(article.row.title.query);
        let main = dom(elem).find(article.row.main.query);
        let image = dom(elem).find(article.row.image.query);
        let imgUrl = "";

        if (article.row.image.attr !== "" && image.attr(article.row.image.attr) !== undefined) {
            imgUrl = image.attr()[article.row.image.attr];
        } else {
            imgUrl = image.text();
        }

        let hrefPath = article.row.link.query === "" ? elem.attribs[article.row.link.attr]:
            dom(elem).find(article.row.link.query).attr()[article.row.link.attr];
        if (title.text() === "" || main.text() === "") {
            return;
        }

        newsList.push({
            origin: article.name,
            href: article.row.link.baseUrl + hrefPath,
            title: title.text(),
            main: main.text(),
            category: article.category,
            image: article.row.image.baseUrl + imgUrl
        });
    });
    return newsList;
}

module.exports = {
    scrape,
    scrapeCSR
}
