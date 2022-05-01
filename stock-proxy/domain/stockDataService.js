const yahoo = require("../adapter/yahoo");
const alphavantage = require("../adapter/alphavantage");
const tokenService = require("./apiTokenService.js");

/**
 * Simple Moving Average.
 * @param timestamps []
 * @param close []
 * @param lastPeriodDays number of days
 * @returns {*[][]|[]}
 */
function calcSMA(timestamps, close, lastPeriodDays) {
    let sma = [];

    if (lastPeriodDays === 0 || close.length < lastPeriodDays) {
        return [[]];
    }

    for (let i = lastPeriodDays - 1; i < close.length; i++) {
        let closeEntry = 0;
        for (let d = i - (lastPeriodDays - 1); d <= i; d++) {
            closeEntry += close[d];
        }
        let entryVec = [timestamps[i], closeEntry / lastPeriodDays];
        sma.push(entryVec);
    }

    return sma;
}

/**
 * Exponential moving average.
 * @param timestamp []
 * @param close []
 * @param lastPeriodDays number of days
 * @returns {*[][]|[]}
 */
function calcEMA(timestamp, close, lastPeriodDays) {
    if ((lastPeriodDays - 1) > close.length) {
        return [[]];
    }

    let emaVec = [];
    let sum = 0;
    for (let i = 0; i < lastPeriodDays; i++) {
        sum += close[i];
    }

    emaVec.push([timestamp[lastPeriodDays - 1], sum / lastPeriodDays]);
    let indexVec = 1;
    for (let i = lastPeriodDays; i < close.length; i++) {
        let emaPrevious = emaVec[indexVec - 1][1];
        let multiplier = (2 / (lastPeriodDays + 1));
        let ema = (close[i] - emaPrevious)  * multiplier + emaPrevious;
        emaVec.push([timestamp[i], ema]);
        indexVec++;
    }

    return emaVec;
}

/**
 * Moving average convergence divergence.
 * @param timestamp []
 * @param close []
 * @param shortPeriod number of days
 * @param longPeriod number of days
 * @param signalPeriod number of days
 * @returns {[]} [[timestamp, macd, signal]]
 */
function calcMACD(timestamp, close, shortPeriod, longPeriod, signalPeriod) {
    let emaShortTerm = calcEMA(timestamp, close, shortPeriod);
    let emaLongTerm = calcEMA(timestamp, close, longPeriod);
    let startIndex =  emaShortTerm.length - emaLongTerm.length;
    let macdVec = [];

    for (let i = startIndex; i < emaShortTerm.length; i++) {
        macdVec.push(emaShortTerm[i]);
    }

    let sigTimestamp = [];
    let sigMacd = [];

    for (let i = 0; i < emaLongTerm.length; i++) {
        let closeLong = emaLongTerm[i][1];
        let macd = macdVec[i][1] - closeLong;
        macdVec[i][1] = macd;

        sigTimestamp.push(macdVec[i][0]);
        sigMacd.push(macd);
    }

    let signal = calcEMA(sigTimestamp, sigMacd, signalPeriod);
    let signalIndex = 0;
    for (let i = signalPeriod - 1; i < macdVec.length; i++) {
        macdVec[i].push(signal[signalIndex][1]);
        signalIndex++;
    }
    return macdVec;
}

function roundDigits(number, decimalPlaces) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
}

function calcRSIOverAll(timestamp, adjClose, observeTimeUnits) {
    let startIndex = observeTimeUnits - 1;
    if (startIndex > adjClose.length) {
        return [[]];
    }
    let rsiVec = [];
    for (let i = startIndex; i < adjClose.length; i++) {
        let directionVector = [];
        for (let t = i - startIndex + 1; t <= i; t++) {
            let diffPrice = adjClose[t] - adjClose[t - 1];
            directionVector.push(diffPrice);
        }
        let positiveSum = 0;
        let negativeSum = 0;
        directionVector.forEach(elem => {
            if (elem >= 0) {
                positiveSum += elem;
            } else {
                negativeSum += Math.abs(elem);
            }
        });
        let meaPositive = positiveSum / observeTimeUnits;
        let meanNegative = negativeSum / observeTimeUnits;
        let rsi =  roundDigits(meaPositive / (meaPositive + meanNegative) * 100, 2);
        let resultVec = [timestamp[i], rsi];
        rsiVec.push(resultVec);
    }
    return rsiVec;
}

/**
 * Map stock data for ui.
 * @param responseData {timestamps:[], closes:[], opens:[], highs:[], lows:[], volumes:[], adjcloses:[]}
 * @returns {{chartData: [timestamps, opens, highs, lows, closes, volumes], adjData: []}}
 */
function createChartData(responseData) {
    let ohlcvArray = [];
    let adjArray = [];

    for (let i = 0; i < responseData.timestamps.length; i++) {
        let timestamp = responseData.timestamps[i];
        let close = responseData.closes[i];
        let open = responseData.opens[i];
        let high = responseData.highs[i];
        let low = responseData.lows[i];
        let volume = responseData.volumes[i];
        let chartVector = [timestamp, open, high, low, close, volume];
        ohlcvArray.push(chartVector);

        let adjData = responseData.adjcloses[i];
        let adjVector = [timestamp, adjData];
        adjArray.push(adjVector);
    }
    return {
        chartData: ohlcvArray,
        adjData: adjArray
    }
}

function calcRelativeStrengthIndexForLastCourse(adjClose, observeTimeUnits) {
    let startIndex = adjClose.length - observeTimeUnits;
    if (startIndex < 0) {
        return "N/A";
    }

    let directionVector = [];
    for (let i = startIndex; i < adjClose.length - 1; i++) {
        let diffPrice = adjClose[i + 1] - adjClose[i];
        directionVector.push(diffPrice);
    }
    let positiveSum = 0;
    let negativeSum = 0;
    directionVector.forEach(elem => {
        if (elem >= 0) {
            positiveSum += elem;
        } else {
            negativeSum += Math.abs(elem);
        }
    });
    let meaPositive = positiveSum / observeTimeUnits;
    let meanNegative = negativeSum / observeTimeUnits;
    let rsi = meaPositive / (meaPositive + meanNegative) * 100;
    return roundDigits(rsi, 2);
}

function createChartDataResponse(responseData) {
    let mappedChartData = createChartData(responseData);
    return  {
        sym: responseData.symbol,
        chart: mappedChartData.chartData,
        chartAdjclose: mappedChartData.adjData,
        sma30: calcSMA(responseData.timestamps, responseData.closes, 30),
        sma100: calcSMA(responseData.timestamps, responseData.closes,100),
        macd: calcMACD(responseData.timestamps, responseData.closes, 12, 26, 9),
        rsi14: calcRSIOverAll(responseData.timestamps, responseData.closes, 14)
    }
}

function createWatchItem(observedStock, responseData) {
    let mappedChartData = createChartData(responseData);
    let entryPrice = observedStock.entryPrice;
    let diffPrice = (responseData.regularMarketPrice * observedStock.quantity) - (entryPrice * observedStock.quantity);
    let status = "=";
    if (diffPrice > 0) {
        status = "+";
    } else if (diffPrice < 0) {
        status = "-";
    }

    let winPercentage = diffPrice * 100 / (entryPrice * observedStock.quantity);
    let rounded = roundDigits(winPercentage, 2);
    let displayed = rounded > 0 ? "+" + rounded : rounded;
    let win = roundDigits(diffPrice, 4) + " " + responseData.currency + " ("+ displayed + "%)";

    return {
        name: observedStock.companyName + ` (${responseData.symbol})`,
        countryCode: observedStock.countryCode,
        sym: responseData.symbol,
        currentPrice: responseData.regularMarketPrice,
        entryPrice: entryPrice,
        win: win,
        quantity: observedStock.quantity,
        currency: responseData.currency,
        status: status,
        observeOnly: observedStock.observeOnly,
        rsi: calcRelativeStrengthIndexForLastCourse(responseData.closes, 14),
        chartData: {
            sym: responseData.symbol,
            chart: mappedChartData.chartData,
            chartAdjclose: mappedChartData.adjData
        }
    }
}

function getWatchItem(observedStock, range) {
    return new Promise((resolve, reject) => {
        yahoo.fetchStockData(observedStock.name, range).then((response) => {
            let responseData = yahoo.mapStockData(response.data);
            let watchItem = createWatchItem(observedStock, responseData);
            resolve(watchItem);
        }).catch((err) => {
            console.error(err);
            reject(err);
        });
    });
}

/**
 * Stock data from yahoo.
 * @param sym stock symbol
 * @param range time range
 * @returns {Promise<unknown>}
 */
function getStockDataYahoo(sym, range) {
    return new Promise((resolve, reject) => {
        yahoo.fetchStockData(sym, range).then((response) => {
            let responseData = yahoo.mapStockData(response.data);
            let chartDataMapped = createChartDataResponse(responseData);
            resolve(chartDataMapped);
        }).catch((err) => {
            console.error(err);
            reject(err);
        });
    });
}

/**
 * Stock data from ALPHA VANTAGE
 * @param sym
 * @param interval
 * @param functionType
 * @returns {Promise<unknown>}
 */
function getStockDataAlphaVantage(sym, interval, functionType) {
    return new Promise((resolve, reject) => {
        alphavantage.fetchStockTimeSeries(functionType, sym, interval, tokenService.getAlphavantageToken()).then((response) => {
            let responseData = alphavantage.mapStockData(response.data);
            let chartDataMapped = createChartDataResponse(responseData);
            resolve(chartDataMapped);
        }).catch((err) => {
            console.error(err);
            reject(err);
        });
    });
}

module.exports = {
    getStockDataYahoo,
    getStockDataAlphaVantage,
    getWatchItem
}