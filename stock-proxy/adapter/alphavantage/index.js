const axios = require("axios");
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
const BASE_URL = "https://www.alphavantage.co";

/**
 * Get stock with time series.
 * @param functionType The time series: TIME_SERIES_INTRADAY, TIME_SERIES_INTRADAY_EXTENDED, TIME_SERIES_DAILY,
 *                                      TIME_SERIES_WEEKLY, TIME_SERIES_WEEKLY_ADJUSTED, TIME_SERIES_MONTHLY
 *                                      TIME_SERIES_MONTHLY_ADJUSTED
 * @param symbol The name of the equity
 * @param interval Time interval between two consecutive data points in the time series.
 *                 The following values are supported: 1min, 5min, 15min, 30min, 60min
 * @param apiKey Api access key.
 * @param adjusted The output time series is adjusted by historical split and dividend events. default is true
 * @param outputsize Strings "compact" and "full" are accepted with the following specifications:
 *                   compact returns only the latest 100 data points in the intraday time series;
 *                   full returns the full-length intraday time series.
 *                   The "compact" option is recommended if you would like to reduce the data size of each API call.
 *                   default is "compact"
 * @param datatype Strings "json" and "csv" are accepted with the following specifications:
 *                 json returns the intraday time series in JSON format;
 *                 csv returns the time series as a CSV (comma separated value) file. default is "json"
 * @returns {Promise<AxiosResponse<any>>}
 */
function fetchStockTimeSeries(functionType,
                              symbol,
                              interval,
                              apiKey,
                              adjusted = true,
                              outputsize = "compact",
                              datatype = "json") {
    const url = `${BASE_URL}/query?function=${functionType}` +
                `&symbol=${symbol}` +
                `&interval=${interval}` +
                `&apikey=${apiKey}` +
                `&adjusted=${adjusted}` +
                `&outputsize=${outputsize}` +
                `&datatype=${datatype}`;
    return axios.get(url);
}

function searchSymbol(keywords, apiKey) {
    const url = `${BASE_URL}/query?function=SYMBOL_SEARCH` +
                `&keywords=${keywords}` +
                `&apikey=${apiKey}`;
    return axios.get(url);
}

function getValueByKeyPartName(keyPartName, jsonObject, defaultValue = 0) {
    for (const [key, value] of Object.entries(jsonObject)) {
        if (key.indexOf(keyPartName) > -1) {
            return jsonObject[key];
        }
    }
    return defaultValue;
}

function mapStockData(responseJson) {
    const resultObjectArray = Object.values(responseJson);
    const metaData =  resultObjectArray[0];
    const timeSeriesObject = resultObjectArray[1];
    const timeSeriesArray = Object.keys(timeSeriesObject).map((dateStr) => Date.parse(dateStr));
    let opens = [];
    let highs = [];
    let lows = [];
    let closes = [];
    let volumes = [];
    let adjusted = [];
    for (const [key, value] of Object.entries(timeSeriesObject)) {
        opens.push(getValueByKeyPartName("open", value));
        highs.push(getValueByKeyPartName("high", value));
        lows.push(getValueByKeyPartName("low", value));
        closes.push(getValueByKeyPartName("close", value));
        volumes.push(getValueByKeyPartName("volume", value));
        adjusted.push(getValueByKeyPartName("adjusted", value));
    }

    return {
        timestamps: timeSeriesArray,
        currency: "EUR",
        regularMarketPrice: [],
        symbol: getValueByKeyPartName("Symbol", metaData, "-"),
        closes: closes,
        opens: opens,
        highs: highs,
        lows: lows,
        volumes: volumes,
        adjcloses: adjusted
    }
}

/**
 * Query builder for getting stock with time series.
 * @param functionType The time series: TIME_SERIES_INTRADAY, TIME_SERIES_INTRADAY_EXTENDED, TIME_SERIES_DAILY,
 *                                      TIME_SERIES_WEEKLY, TIME_SERIES_WEEKLY_ADJUSTED, TIME_SERIES_MONTHLY
 *                                      TIME_SERIES_MONTHLY_ADJUSTED
 * @param symbol The name of the equity
 * @param interval Time interval between two consecutive data points in the time series.
 *                 The following values are supported: 1min, 5min, 15min, 30min, 60min
 * @param adjusted The output time series is adjusted by historical split and dividend events. default is true
 * @param slice Two years of minute-level intraday data contains over 2 million data points, which can take up to Gigabytes of memory.
 *              To ensure optimal API response speed, the trailing 2 years of intraday data is evenly divided into 24 "slices" -
 *              year1month1, year1month2, year1month3, ...,
 *              year1month11, year1month12, year2month1, year2month2, year2month3, ...,
 *              year2month11, year2month12.
 *              Each slice is a 30-day window, with year1month1 being the most recent and year2month12 being the farthest from today.
 *              By default, slice=year1month1.
 * @param outputsize Strings "compact" and "full" are accepted with the following specifications:
 *                   compact returns only the latest 100 data points in the intraday time series;
 *                   full returns the full-length intraday time series.
 *                   The "compact" option is recommended if you would like to reduce the data size of each API call.
 *                   default is "compact"
 * @param datatype Strings "json" and "csv" are accepted with the following specifications:
 *                 json returns the intraday time series in JSON format;
 *                 csv returns the time series as a CSV (comma separated value) file. default is "json"
 */
function queryBuilder() {
    let baseUrl = `${BASE_URL}/query`;
    let queryMap = {
        outputsize: "compact",
        datatype: "json"
    };
    return {
        function: function (query) {
            queryMap.function = query;
            return this;
        },
        symbol: function (subredditName) {
            queryMap.symbol = subredditName;
            return this;
        },
        interval: function (interval) {
            queryMap.interval = interval;
            return this;
        },
        apikey: function (apikey) {
            queryMap.apikey = apikey;
            return this;
        },
        adjusted: function (isAdjusted) {
            queryMap.adjusted = isAdjusted;
            return this;
        },
        slice: function (slice) {
            queryMap.slice = slice;
            return this;
        },
        outputsize: function (outputsize) {
            queryMap.size = outputsize;
            return this;
        },
        datatype: function (datatype) {
            queryMap.datatype = datatype;
            return this;
        },
        build: function () {
            let url = baseUrl;
            switch (queryMap['function']) {
                case 'TIME_SERIES_INTRADAY':
                case 'TIME_SERIES_INTRADAY_EXTENDED':
                    if (queryMap.interval === undefined) {
                        throw Error(`function ${queryMap['function']} require interval parameter`);
                    }
                    if (queryMap.slice === undefined) {
                        throw Error(`function ${queryMap['function']} require slice parameter`);
                    }
                    break;
                default:
                    if (queryMap.apikey === undefined) {
                        throw Error(`require apikey parameter`);
                    }
                    if (queryMap.function === undefined) {
                        throw Error(`require function parameter`);
                    }
                    if (queryMap.symbol === undefined) {
                        throw Error(`function ${queryMap['function']} require symbol parameter`);
                    }
            }
            let isFirst = true;
            for (let property in queryMap) {
                if (isFirst) {
                    url += `?${property}=${queryMap[property]}`;
                    isFirst = false;
                    continue;
                }
                url += `&${property}=${queryMap[property]}`;
            }
            return url;
        }
    }
}


module.exports = {
    fetchStockTimeSeries,
    mapStockData,
    searchSymbol,
    queryBuilder
}
