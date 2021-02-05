const axios = require("axios");

function roundDigits(number, decimalPlaces) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
}

function calcRSIOverAll(stockData, observeTimeUnits) {
    let adjClose = stockData.chart.result[0].indicators.quote[0].close;
    let timestamp = stockData.chart.result[0].timestamp.map(time => time * 1000);
    let startIndex = observeTimeUnits - 1;
    if (startIndex > adjClose.length) {
        return [[]];
    }
    let rsiVec = [];
    for (let i = startIndex; i < adjClose.length - 1; i++) {
        let directionVector = [];
        for (let t = i - startIndex; t <= i; t++) {
            let diffPrice = adjClose[t + 1] - adjClose[t];
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

function calcRelativeStrengthIndexForLastCourse(stockData, observeTimeUnits) {
    let adjClose = stockData.chart.result[0].indicators.quote[0].close;
    let regularMarketPrice = stockData.chart.result[0].meta.regularMarketPrice;
    let startIndex = adjClose.length - observeTimeUnits;

    if (startIndex < 0) {
        return "N/A";
    }

    let directionVector = [];
    for (let i = startIndex; i < adjClose.length - 1; i++) {
        let diffPrice = adjClose[i + 1] - adjClose[i];
        directionVector.push(diffPrice);
    }
    directionVector.push(regularMarketPrice - adjClose[adjClose.length - 1]);

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

function fetchStockData(symbol, range) {
    let baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";
    let path = "?formatted=true&lang=de-DE&region=DE&includeAdjustedClose=true&interval=1d&range="
        + range + "&corsDomain=de.finance.yahoo.com";

    return axios.get(baseUrl + symbol + path);
}

function fetchFinancials(symbol) {
    let baseUrl = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/";
    let path = "?formatted=true&lang=en-US&region=US&modules=incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory,incomeStatementHistoryQuarterly,cashflowStatementHistoryQuarterly,balanceSheetHistoryQuarterly,earnings&corsDomain=finance.yahoo.com"
    return axios.get(baseUrl + symbol + path);
}

function createChartData(timestamps, chartData, chartAdjclose) {
    let ohlcvArray = [];
    let adjArray = [];

    for (let i = 0; i < timestamps.length; i++) {
        let timestamp = timestamps[i];
        let close = chartData.close[i];
        let open = chartData.open[i];
        let high = chartData.high[i];
        let low = chartData.low[i];
        let volume = chartData.volume[i];
        let chartVector = [timestamp, open, high, low, close, volume];
        ohlcvArray.push(chartVector);

        let adjData = chartAdjclose.adjclose[i];
        let adjVector = [timestamp, adjData];
        adjArray.push(adjVector);
    }
    return {
        chartData: ohlcvArray,
        adjData: adjArray
    }
}

function mapChartDataFromResponse(stockDataResponse) {
    let timestamp = stockDataResponse.chart.result[0].timestamp.map(time => time * 1000);
    let mappedChartData = createChartData(timestamp,
        stockDataResponse.chart.result[0].indicators.quote[0],
        stockDataResponse.chart.result[0].indicators.adjclose[0]);

    return  {
        sym: stockDataResponse.chart.result[0].meta.symbol,
        chart: mappedChartData.chartData,
        chartAdjclose: mappedChartData.adjData,
        sma30: calcSMA(stockDataResponse, 30),
        sma100: calcSMA(stockDataResponse, 100),
        rsi14: calcRSIOverAll(stockDataResponse, 14)
    }
}

function createWatchItem(observedStock, stockData) {
    let regularMarketPrice = stockData.chart.result[0].meta.regularMarketPrice;
    let timestamp = stockData.chart.result[0].timestamp.map(time => time * 1000);
    let mappedChartData = createChartData(timestamp, stockData.chart.result[0].indicators.quote[0], stockData.chart.result[0].indicators.adjclose[0]);
    let currency = stockData.chart.result[0].meta.currency;
    let chartData = mappedChartData.chartData;
    let adjclose =  mappedChartData.adjData;
    let entryPrice = observedStock.entryPrice;
    let name = stockData.chart.result[0].meta.symbol;
    let companyName = observedStock.companyName;

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
    let win = roundDigits(diffPrice, 4)+ " "+currency + " ("+ displayed + "%)";

    return {
        name: companyName + ` (${name})`,
        sym: name,
        currentPrice: regularMarketPrice,
        entryPrice: entryPrice,
        win: win,
        winPercentage: winPercentage,
        quantity: observedStock.quantity,
        currency: currency,
        status: status,
        observeOnly: observedStock.observeOnly,
        rsi: calcRelativeStrengthIndexForLastCourse(stockData, 14),
        chartData: {
            sym: name,
            chart: chartData,
            chartAdjclose: adjclose
        }
    }
}

/**
 * Simple Moving Average
 * @param stockData
 * @param lastPeriodDays
 * @returns {*[][]|[]}
 */
function calcSMA(stockData, lastPeriodDays) {
    let sma = [];
    let timestamp = stockData.chart.result[0].timestamp.map(time => time * 1000);
    let close = stockData.chart.result[0].indicators.quote[0].close;
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


module.exports = {
    fetchStockData,
    fetchFinancials,
    createWatchItem,
    mapChartDataFromResponse
}
