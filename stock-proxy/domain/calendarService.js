const boersenNews = require("../adapter/boersennews");

function getCalendar() {
    return boersenNews.fetchCalendar();
}

module.exports = {
    getCalendar
}