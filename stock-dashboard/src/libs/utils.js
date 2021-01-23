
function roundTwoDigit(value) {
    let calced = (Math.round(value * 100) / 100);
    return calced;
}


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

export function createWinLostList(watchlist) {
    let win = {};
    let lost = {};
    watchlist.forEach(stock => {
        let diff = (stock.currentPrice * stock.quantity) - (stock.entryPrice * stock.quantity);
        if (diff > 0) {
            if (win[stock.currency]) {
                win[stock.currency] += diff;
            } else {
                win[stock.currency] = diff;
            }
        } else {
            if (lost[stock.currency]) {
                lost[stock.currency] += diff;
            } else {
                lost[stock.currency] = diff;
            }
        }
    });

    let mappedWinArr = [];
    let mappedLostArr = [];

    Object.keys(win).forEach((key) => {
        mappedWinArr.push({
            currency: key,
            win: roundTwoDigit(win[key])
        });
    });
    Object.keys(lost).forEach((key) => {
        mappedLostArr.push({
            currency: key,
            lost: roundTwoDigit(lost[key])
        });
    });

    return {
        win: mappedWinArr,
        lost: mappedLostArr
    }
}

export function createWinLost(watchlist) {

    let win = 0;
    let lost = 0;
    let investedCapital = 0;
    watchlist.forEach(stock => {
        investedCapital += stock.entryPrice * stock.quantity;
        let diff = (stock.currentPrice * stock.quantity) - (stock.entryPrice * stock.quantity);
        if (diff > 0) {
            win += diff;
        } else {
            lost += diff;
        }
    });
    return {
        win: roundTwoDigit(win),
        lost: roundTwoDigit(lost),
        invested: roundTwoDigit(investedCapital)
    }
}