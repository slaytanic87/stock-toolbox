const axios = require("axios");
const indices = require("./indices.js");

/**
 * Fetch stock data
 * @param symbol stock symbol follows with market place e.g LHL.F = Lenovo/Frankfurt
 * @param range valid ranges ["1d","5d","1mo","3mo","6mo","1y","2y","5y","10y","ytd","max"]
 * @param interval data granularity ["15m", "1d"]
 * @param lang language e.g de-DE, ch-FR, en-US
 * @param region country e.g DE, CH, FR, US
 * @returns {Promise<AxiosResponse<any>>}
 */
function fetchStockData(symbol, range, interval = "1d", lang = "de-DE", region = "DE") {
    let baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";
    let path = `?formatted=true
                &lang=${lang}
                &region=${region}
                &includeAdjustedClose=true
                &interval=${interval}
                &range=${range}
                &corsDomain=de.finance.yahoo.com`;

    return axios.get(baseUrl + symbol + path,{ headers: {}});
}

/**
 * Get yahoo financials
 * @param symbol
 * @param lang
 * @param region
 * @returns {Promise<AxiosResponse<any>>}
 */
function fetchFinancials(symbol, lang = "en-US", region = "US") {
    let baseUrl = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/";
    let path = `?formatted=true
                &lang=${lang}
                &region=${region}
                &modules=incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory,incomeStatementHistoryQuarterly,cashflowStatementHistoryQuarterly,balanceSheetHistoryQuarterly,earnings
                &corsDomain=finance.yahoo.com`
    return axios.get(baseUrl + symbol + path);
}

function mapStockData(responseData) {
    let timestamps = responseData.chart.result[0].timestamp.map(timeSeconds => timeSeconds * 1000);
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
