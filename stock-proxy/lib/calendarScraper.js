const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const scraperRule =             {
    "name": "Börsennews.de",
    "renderingType": "server",
    "url": "https://www.boersennews.de/handelskalender/",
    "query": "div[class=row] table[id=calendar-DataTable] > tbody > tr",
    "forEachRow": {
        "day": {
            "query": "td[class=bg-muted]"
        },
        "event": {
            "query": "strong[class=text-black]"
        },
        "countryList": {
            "query": "tr[class='small text-center'] > th > span"
        },
        "statusList": {
            "query": "tr[class=text-center] > td > i",
            "forEachRow": {
                "query": "",
                "statusFieldAttr": "title",
                "green": "Handel möglich",
                "yellow": "eingeschränkter Handel",
                "red": "kein Handel"
            }
        }
    }
}

async function scrapeCSR(calendarScrapeRule) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(calendarScrapeRule.url);
        const data = await page.content();
        await browser.close();
        const dom = cheerio.load(data);
        return parseCalendar(dom, calendarScrapeRule);
    } catch (ex) {
        throw new Error(ex);
    }
}

function scrapeSSR(calendarScrapeRule) {
    return new Promise((resolve, reject) => {
        axios.get(calendarScrapeRule.url).then((resp) => {
            const dom = cheerio.load(resp.data);
            let calendarList = parseCalendar(dom, calendarScrapeRule);
            resolve(calendarList);
        }).catch((error)=> {
            console.error(error);
            reject(error);
        });
    });
}

function parseCalendar(dom, calendarScrapeRule) {
    let calendarArr = [];
    let calendarEntryRows = dom(calendarScrapeRule.query);
    calendarEntryRows.each((index, elem) => {
        let day = dom(elem).find(calendarScrapeRule.forEachRow.day.query).text();
        let event = dom(elem).find(calendarScrapeRule.forEachRow.event.query).text();
        let countriesArr = getCountryHeader(dom, dom(elem).find(calendarScrapeRule.forEachRow.countryList.query));
        let statusArr = getStatus(dom, dom(elem).find(calendarScrapeRule.forEachRow.statusList.query), calendarScrapeRule);
        calendarArr.push({
            day: day,
            event: event,
            countries: countriesArr,
            status: statusArr
        });
    });
    return calendarArr;
}


function getCountryHeader(dom, rows) {
    let countries = [];
    rows.each((index, elem) => {
        countries.push(dom(elem).text());
    });
    return countries;
}

function getStatus(dom, rows, calendarScrapeRule) {
    let status = [];
    rows.each((index, elem) => {
        let statusStr = "";
        if (calendarScrapeRule.forEachRow.statusList.forEachRow.query !== "") {
            statusStr = dom(elem).find(calendarScrapeRule.forEachRow.statusList.forEachRow.query).text();
        } else {
            statusStr = String.prototype.toLowerCase.apply(dom(elem).attr(calendarScrapeRule.forEachRow.statusList.forEachRow.statusFieldAttr))
                .replace(/\s+/g, "");
        }
        let color = "";
        if (statusStr === String.prototype.toLowerCase.apply(calendarScrapeRule.forEachRow.statusList.forEachRow.green)
            .replace(/\s+/g, "")) {
            color = "green";
        } else if (statusStr === String.prototype.toLowerCase.apply(calendarScrapeRule.forEachRow.statusList.forEachRow.yellow)
            .replace(/\s+/g, "")) {
            color = "yellow";
        } else if (statusStr === String.prototype.toLowerCase.apply(calendarScrapeRule.forEachRow.statusList.forEachRow.red)
            .replace(/\s+/g, "")) {
            color = "red";
        }
        status.push(color);
    });
    return status;
}

module.exports = {
    scrapeSSR,
    scrapeCSR
}