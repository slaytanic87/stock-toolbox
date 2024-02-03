/**
 * map backend data to kline data
 * @param chartDataFromBackend [[timestamp, open, high, low, close, volume]]
 * @returns [{timestamp, open, high, low, close, volume},..{}]
 */
export function mapToKlineChartData(chartDataFromBackend) {
    return chartDataFromBackend.map(entry => {
         return {
            open: entry[1],
            close: entry[4],
            high: entry[2],
            low: entry[3],
            volume: entry[5],
            timestamp: entry[0],
        }
    })
}
