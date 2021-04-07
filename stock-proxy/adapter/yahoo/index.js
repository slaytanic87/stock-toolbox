const axios = require("axios");
const indices = require("./indices.js");

function fetchStockData(symbol, range) {
    let baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";
    let path = "?formatted=true&lang=de-DE&region=DE&includeAdjustedClose=true&interval=1d&range="
        + range + "&corsDomain=de.finance.yahoo.com";

    return axios.get(baseUrl + symbol + path,{ headers: {}});
}

function fetchFinancials(symbol) {
    let baseUrl = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/";
    let path = "?formatted=true&lang=en-US&region=US&modules=incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory,incomeStatementHistoryQuarterly,cashflowStatementHistoryQuarterly,balanceSheetHistoryQuarterly,earnings&corsDomain=finance.yahoo.com"
    return axios.get(baseUrl + symbol + path);
}

function mapStockData(responseData) {
    let timestamps = responseData.chart.result[0].timestamp.map(time => time * 1000);
    let currency = responseData.chart.result[0].meta.currency;
    let regularMarketPrice = responseData.chart.result[0].meta.regularMarketPrice;
    let symbol = responseData.chart.result[0].meta.symbol;
    let closes = responseData.chart.result[0].indicators.quote[0].close;
    let opens = responseData.chart.result[0].indicators.quote[0].open;
    let highs = responseData.chart.result[0].indicators.quote[0].high;
    let lows = responseData.chart.result[0].indicators.quote[0].low;
    let volumes = responseData.chart.result[0].indicators.quote[0].volume;
    let adjcloses = responseData.chart.result[0].indicators.adjclose[0].adjclose;

    return {
        timestamps: timestamps,
        currency: currency,
        regularMarketPrice: regularMarketPrice,
        symbol: symbol,
        closes: closes,
        opens: opens,
        highs: highs,
        lows: lows,
        volumes: volumes,
        adjcloses: adjcloses
    }
}

module.exports = {
    fetchStockData,
    fetchFinancials,
    mapStockData,
    indices
}
