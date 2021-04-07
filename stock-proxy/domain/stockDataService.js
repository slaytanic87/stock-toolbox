const yahoo = require("../adapter/yahoo");

/**
 * Simple Moving Average
 * @param stockData
 * @param lastPeriodDays
 * @returns {*[][]|[]}
 */
function calcSMA(timestamp, close, lastPeriodDays) {
    let sma = [];

    if (lastPeriodDays === 0 || close.length < lastPeriodDays) {
        return [[]];
    }

    for (let i = lastPeriodDays - 1; i < close.length; i++) {
        let closeEntry = 0;
        for (let d = i - (lastPeriodDays - 1); d <= i; d++) {
            closeEntry += close[d];
        }
        let entryVec = [timestamp[i], closeEntry / lastPeriodDays];
        sma.push(entryVec);
    }

    return sma;
}

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
 * @param timestamps array of timestamps
 * @param close array of close course
 * @param open array of open course
 * @param high array of high course
 * @param low array of low course
 * @param volume array of volume
 * @param adjclose array of adjust close course
 * @returns {{chartData: [], adjData: []}}
 */
function createChartData(timestamps, closes, opens, highs, lows, volumes, adjcloses) {
    let ohlcvArray = [];
    let adjArray = [];

    for (let i = 0; i < timestamps.length; i++) {
        let timestamp = timestamps[i];
        let close = closes[i];
        let open = opens[i];
        let high = highs[i];
        let low = lows[i];
        let volume = volumes[i];
        let chartVector = [timestamp, open, high, low, close, volume];
        ohlcvArray.push(chartVector);

        let adjData = adjcloses[i];
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

function createChartDataResponse(symbol, timestamp, close, open, high, low, volume, adjclose) {
    let mappedChartData = createChartData(timestamp, close, open, high, low, volume, adjclose);
    return  {
        sym: symbol,
        chart: mappedChartData.chartData,
        chartAdjclose: mappedChartData.adjData,
        sma30: calcSMA(timestamp, close, 30),
        sma100: calcSMA(timestamp, close,100),
        macd: calcMACD(timestamp, close, 12, 26, 9),
        rsi14: calcRSIOverAll(timestamp, close, 14)
    }
}

function createWatchItem(observedStock,
                         name,
                         currency,
                         regularMarketPrice,
                         timestamp,
                         closes,
                         opens,
                         highs,
                         lows,
                         volumes,
                         adjcloses) {

    let mappedChartData = createChartData(timestamp, closes, opens, highs, lows, volumes, adjcloses);
    let entryPrice = observedStock.entryPrice;
    let diffPrice = (regularMarketPrice * observedStock.quantity) - (entryPrice * observedStock.quantity);
    let status = "=";
    if (diffPrice > 0) {
        status = "+";
    } else if (diffPrice < 0) {
        status = "-";
    }

    let winPercentage = diffPrice * 100 / (entryPrice * observedStock.quantity);
    let rounded = roundDigits(winPercentage, 2);
    let displayed = rounded > 0 ? "+" + rounded : rounded;
    let win = roundDigits(diffPrice, 4) + " " + currency + " ("+ displayed + "%)";

    return {
        name: observedStock.companyName + ` (${name})`,
        countryCode: observedStock.countryCode,
        sym: name,
        currentPrice: regularMarketPrice,
        entryPrice: entryPrice,
        win: win,
        quantity: observedStock.quantity,
        currency: currency,
        status: status,
        observeOnly: observedStock.observeOnly,
        rsi: calcRelativeStrengthIndexForLastCourse(closes, 14),
        chartData: {
            sym: name,
            chart: mappedChartData.chartData,
            chartAdjclose: mappedChartData.adjData
        }
    }
}


function getWatchItem(observedStock, range) {
    return new Promise((resolve, reject) => {
        yahoo.fetchStockData(observedStock.name, range).then((response) => {
            let responseData = response.data;
            let indicators = responseData.chart.result[0].indicators;
            let timestamp = responseData.chart.result[0].timestamp.map(time => time * 1000);
            let currency = responseData.chart.result[0].meta.currency;
            let regularMarketPrice = responseData.chart.result[0].meta.regularMarketPrice;
            let symbol = responseData.chart.result[0].meta.symbol;
            let closes = indicators.quote[0].close;
            let opens = indicators.quote[0].open;
            let highs = indicators.quote[0].high;
            let lows = indicators.quote[0].low;
            let volumes = indicators.quote[0].volume;
            let adjcloses = indicators.adjclose[0].adjclose;

            let watchItem = createWatchItem(observedStock, symbol, currency, regularMarketPrice, timestamp,
                closes, opens, highs, lows, volumes, adjcloses);
            resolve(watchItem);
        }).catch((err)=> {
            reject(err);
        });
    });
}

/**
 * @param sym
 * @param range
 * @returns {Promise<unknown>}
 */
function getStockData(sym, range) {
    return new Promise((resolve, reject) => {
        yahoo.fetchStockData(sym, range).then((response)=> {
            let responseData = response.data;
            let symbol = responseData.chart.result[0].meta.symbol;
            let timestamps = responseData.chart.result[0].timestamp.map(time => time * 1000);
            let closes = responseData.chart.result[0].indicators.quote[0].close;
            let opens = responseData.chart.result[0].indicators.quote[0].open;
            let highs = responseData.chart.result[0].indicators.quote[0].high;
            let lows = responseData.chart.result[0].indicators.quote[0].low;
            let volumes = responseData.chart.result[0].indicators.quote[0].volume;
            let adjcloses = responseData.chart.result[0].indicators.adjclose[0].adjclose;
            let watchItem = createChartDataResponse(symbol, timestamps, closes, opens, highs, lows, volumes, adjcloses);
            resolve(watchItem);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });

    })
}

module.exports = {
    getStockData,
    getWatchItem
}