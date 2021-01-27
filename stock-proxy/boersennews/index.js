const axios = require("axios");
const cheerio = require("cheerio");


function fetchNews(url, res) {
    axios.get(url).then((resp) => {
        let newsList = [];
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
                href: elem.attribs["href"],
                title: title.text(),
                main: p.text()
            })
        });
        res.json(newsList);
        res.end();
    }).catch((error) => {
        console.log(error.response);
    });
}

/**
 *
 * @param  HTMLCollectionOf<HTMLElementTagNameMap[string]> links
 */
function getNews(links) {

}

module.exports = {
    fetchNews
}
