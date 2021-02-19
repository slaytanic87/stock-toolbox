const axios = require("axios");
const cheerio = require("cheerio");
const baseUrl = "https://www.boersennews.de";
const calendar = baseUrl + "/handelskalender/";

function getCountryHeader(dom, rows) {
    let countries = [];
    rows.each((index, elem) => {
        countries.push(dom(elem).text());
    });
    return countries;
}


function fetchCalendar(res) {
    let calendarArr = [];
    axios.get(calendar).then((resp) => {
        const dom = cheerio.load(resp.data);
        let rows = dom("div[class=row] table[id=calendarTable] > tbody > tr");
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
        let statusStr = String.prototype.toLowerCase.apply(dom(elem).attr("title"))
            .replace(/\s+/g, "");
        let color = "green";
        if (statusStr === String.prototype.toLowerCase.apply("eingeschränkter Handel")
            .replace(/\s+/g, "")) {
            color = "yellow";
        } else if (statusStr === String.prototype.toLowerCase.apply("kein Handel")
            .replace(/\s+/g, "")) {
            color = "red";
        }
        status.push(color);
    });
    return status;
}

module.exports = {
    fetchCalendar
}
