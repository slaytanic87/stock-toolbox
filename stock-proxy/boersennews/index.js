const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://www.boersennews.de";
const topNewsUrl = baseUrl + "/nachrichten/top-news/";
const exclusiveNews = baseUrl + "/nachrichten/id/183/";
const calendar = baseUrl + "/handelskalender/"

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

function fetchCalendar(res) {
    let calendarArr = [];
    axios.get(calendar).then((resp) => {
        const dom = cheerio.load(resp.data);
        let rows = dom("div[class=row]").find("table[id=calendarTable] > tbody > tr");
        rows.each((index, elem) => {
            let day = dom(elem).find("span[class=text-white]").text();
            let event = dom(elem).find("strong[class=text-black]").text();
            let countriesArr = getCountryHeader(dom, dom(elem).find("tr[class='small text-center'] > th > span"));
            let statusArr = getStatus(dom, dom(elem).find("tr[class=text-center] > td > i"));
            calendarArr.push({
                day: day,
                event: event,
                countries: countriesArr,
                status: statusArr
            });
        });
        res.json(calendarArr);
        res.end();
    }).catch((err) => {
       console.log(err);
       res.end();
    });
}

function getStatus(dom, rows) {
    let status = [];
    rows.each((index, elem) => {
        status.push(dom(elem).attr("title"));
    });  
    return status;
}

function getCountryHeader(dom, rows) {
    let countries = [];
    rows.each((index, elem) => {
        countries.push(dom(elem).text());
    });
    return countries;
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
    fetchNews,
    fetchCalendar
}
