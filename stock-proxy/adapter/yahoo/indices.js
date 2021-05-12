const axios = require("axios");

const baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart/";

function fetchIndex(symbol, interval, range) {
    let path = "?includePrePost=false&useYfid=true" +
        "&interval=" + interval +
        "&range=" + range +
        "&corsDomain=de.finance.yahoo.com&.tsrc=finance";

    return axios.get(baseUrl + symbol + path);
}


function createIndexItem(indexData, observedIndex) {
    let timestampsApi = indexData.chart.result[0].timestamp;
    let timestamps = timestampsApi !== undefined ? indexData.chart.result[0].timestamp.map(time => time * 1000) : [];
    let chartData = indexData.chart.result[0].indicators.quote[0];
    let mappedChartData = createChartData(timestamps, chartData);
    return {
        symbol: observedIndex.symbol,
        name: observedIndex.name,
        countryCode: observedIndex.countryCode,
        chartData: {
            sym: indexData.chart.result[0].meta.symbol,
            chart: mappedChartData.chartData,
        }
    }
}

function createSingleIndexItem(indexData) {
    let timestamps = indexData.chart.result[0].timestamp.map(time => time * 1000);
    let chartData = indexData.chart.result[0].indicators.quote[0];
    let mappedChartData = createChartData(timestamps, chartData);
    return {
        chartData: {
            sym: indexData.chart.result[0].meta.symbol,
            chart: mappedChartData.chartData,
        }
    }
}

function createChartData(timestamps, chartData) {
    let ohlcvArray = [];

    for (let i = 0; i < timestamps.length; i++) {
        let close = chartData.close[i];
        let open = chartData.open[i];
        let high = chartData.high[i];
        let low = chartData.low[i];
        let volume = chartData.volume[i];
        let timestamp = timestamps[i];
        let chartVector = [timestamp, open, high, low, close, volume];
        ohlcvArray.push(chartVector);
    }
    return {
        chartData: ohlcvArray
    }
}


module.exports = {
    fetchIndex,
    createIndexItem,
    createSingleIndexItem
}
