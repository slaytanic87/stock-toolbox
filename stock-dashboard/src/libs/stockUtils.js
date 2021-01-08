
function roundTwoDigit(value) {
    let calced = (Math.round(value * 100) / 100);
    return value > 0 ? "+" + calced: calced;
}

export function createWatchItem(observedStock, stockData) {
    let regularMarketPrice = stockData.chart.result[0].meta.regularMarketPrice;
    let currency = stockData.chart.result[0].meta.currency;
    let timestamp = stockData.chart.result[0].timestamp.map(time => time * 1000);
    let chartData = stockData.chart.result[0].indicators.quote[0];
    let entryPrice = observedStock.entryPrice;
    let name = observedStock.name;
    let companyName = observedStock.companyName;

    let diffPrice = regularMarketPrice - entryPrice;
    let status = "="
    if (diffPrice > 0) {
        status = "+"
    } else if (diffPrice < 0) {
        status = "-";
    }

    let winPercentage = diffPrice * 100 / regularMarketPrice;
    let win = roundTwoDigit(diffPrice) + " ("+ roundTwoDigit(winPercentage) + "%)";

    return {
        name: companyName + ` (${name})`,
        currentPrice: regularMarketPrice,
        entryPrice: entryPrice,
        win: win,
        currency: currency,
        status: status,
        chartData: {
            timestamp: timestamp,
            chart: chartData
        }
    }
}

export function createWatchItems(observedStocks, stockDataList) {
    let stocks = [];
    for (let i = 0; i < observedStocks.length; i++) {
        stocks.push(createWatchItem(observedStocks[i], stockDataList[i]));
    }

    return stocks;
}