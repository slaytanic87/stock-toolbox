/**
 * @param {Array} watchlist 
 */
export function createWinPieDiagram(watchlist) {
    let pieNameLabel = [];
    let pieColors = [];
    let pieWinPercentage = [];

    watchlist.forEach(stock => {
        if (stock.winPercentage > 0) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            pieNameLabel.push(stock.name);
            pieColors.push("#" + randomColor);
            pieWinPercentage.push(Math.floor(stock.winPercentage));
        }
    });
    return {
        data: pieWinPercentage,
        labels: pieNameLabel,
        backgroundColor: pieColors
    }
}