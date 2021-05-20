
export function roundDigits(number, decimalPlaces) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
}

/**
 * @param {Array} watchlist
 */
export function createWinPieDiagram(watchlist) {
    let pieNameLabel = [];
    let pieColors = [];
    let pieWinPercentage = [];

    watchlist.forEach(stock => {
        let diffPrice = (stock.currentPrice * stock.quantity) - (stock.entryPrice * stock.quantity);

        if (diffPrice > 0 && !stock.observeOnly) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);

            pieNameLabel.push(stock.name);
            pieColors.push("#" + randomColor);
            pieWinPercentage.push(diffPrice);
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
        if (stock.observeOnly) {
            return;
        }
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
            win: roundDigits(win[key], 4)
        });
    });
    Object.keys(lost).forEach((key) => {
        mappedLostArr.push({
            currency: key,
            lost: roundDigits(lost[key], 4)
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
        if (stock.observeOnly) {
            return;
        }
        investedCapital += stock.entryPrice * stock.quantity;
        let diff = (stock.currentPrice * stock.quantity) - (stock.entryPrice * stock.quantity);
        if (diff > 0) {
            win += diff;
            return;
        }
        lost += diff;
    });
    return {
        win: roundDigits(win, 4),
        lost: roundDigits(lost, 4),
        invested: roundDigits(investedCapital, 4)
    }
}

export function getCurrencySymbol(currency) {
    let currencyMap = {
        EUR: "€",
        USD: "$"
    }
    if (currencyMap[currency]) {
        return currencyMap[currency];
    }
    return currency;
}
