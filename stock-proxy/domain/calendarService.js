const calendar = require("../adapter/boersennews");

function getCalendar() {
    return calendar.fetchCalendar();
}

module.exports = {
    getCalendar
}