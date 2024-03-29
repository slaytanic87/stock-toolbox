const express = require("express");
const app = express();

const watchListService = require("../domain/watchListService.js");
const marketIndexService = require("../domain/marketIndexService.js");
const socialMediaService = require("../domain/socialMediaService.js");
const calendarService = require("../domain/calendarService.js");
const newsService = require("../domain/newsService.js");
const stockDataService = require("../domain/stockDataService.js");
const accountService = require("../domain/accountService.js");
const quoteService = require("../domain/quoteService.js");
const renderingService = require("../domain/renderingService.js");

const path = __dirname + "/../dist/"

app.use(express.static(path));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UNAUTHORIZED = 401;
const INTERNAL_ERROR = 500;

// TODO remove
let user = {
    username: "testuser@test.de",
    password: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0" // mysecret
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/", (req, res) => {
  res.sendFile(path + "index.html");
})

app.post("/indexlist", (req, res) => {
    let userCrendential = req.body;
    marketIndexService.fetchIndexList(userCrendential).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    });
})

app.post("/tags", (req, res) => {
    let userCredentials = req.body;
    let tags = watchListService.fetchTagsFromWatchList(userCredentials);
    res.json(tags);
    res.end();
})

app.post("/v2/watchlist", (req, res) => {
    let userCredentials = req.body
    watchListService.fetchUiWatchList(userCredentials).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    })
})

app.post("/marketIndex", (req, res) => {
    let sym = req.body.symbol;
    marketIndexService.fetchMarketIndexFromApi(sym).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    });
})

app.post("/stock", (req, res) => {
    let range = req.body.range;
    let sym = req.body.sym;
    stockDataService.getStockDataYahoo(sym, range).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.sendStatus(INTERNAL_ERROR);
    });
})

app.post("/alphavantage/stock", (req, res) => {
    let sym = req.body.sym;
    let interval = req.body.interval;
    let functionType = req.body.functionType;
    stockDataService.getStockDataAlphaVantage(sym, interval, functionType).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.sendStatus(INTERNAL_ERROR);
    });
})

app.post("/addStock", (req, res) => {
    let postData = req.body;
    try {
        watchListService.insertStock(postData.stock, postData.user);
    } catch (e) {
        console.error(e);
        res.sendStatus(INTERNAL_ERROR);
    }
    res.end();
})

app.patch("/removeStock", (req, res) => {
    let postData = req.body;
    try {
        watchListService.deleteStock(postData.stock, postData.user);
    } catch (e) {
        console.error(e);
        res.sendStatus(INTERNAL_ERROR);
    }
    res.end();
})

app.post("/news", (req, res) => {
    let userCredentials = req.body;
    newsService.fetchNews(userCredentials).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    });
})

app.get("/calendar", (req, res) => {
    calendarService.getCalendar().then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    })
})

app.post("/reddit", (req, res) => {
    let tags = req.body;
    socialMediaService.getRedditSubmission(tags).then((events) => {
        res.json(events);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    });
})

app.post("/user/create", (req, res) => {
    let user = req.body;
    try {
        let userEntity = accountService.addUser(user.username, user.password, user.firstName, user.name);
        res.json(userEntity);
        res.end();
    } catch (e) {
        console.error(e);
        res.sendStatus(UNAUTHORIZED);
    }
})

app.post("/user/info", (req, res) => {
    let user = req.body;
    let userEntity = accountService.getUser(user.username, user.password);
    res.json(userEntity);
    res.end();
})

app.post("/user/authenticate", (req, res) => {
    let user = req.body;
    try {
        let authenticatedUserEntity = accountService.authenticate(user.username, user.password)
        res.json(authenticatedUserEntity);
    } catch (e) {
        console.error(e);
        res.sendStatus(UNAUTHORIZED);
    }
    res.end();
})

app.post("/watchedStock", (req, res) => {
    let requestObj = req.body;
    try {
        let stock = accountService.getObservedStock(requestObj.user.username, requestObj.user.password, requestObj.symbol);
        res.json(stock);
    } catch (e) {
        console.error(e);
        res.sendStatus(UNAUTHORIZED);
    }
    res.end();
})

app.post("/updateWatchedStock", (req, res) => {
    let requestObj = req.body;
    try {
        accountService.updateObservedStock(requestObj.user.username, requestObj.user.password, requestObj.stock);
    } catch (e) {
        console.error(e);
        res.sendStatus(UNAUTHORIZED);
    }
    res.end();
})

app.post("/user/password/change", (req, res) => {
    let userData = req.body;
    try {
        let changedUser = accountService.changePassword(userData.user, userData.newPassword);
        res.json(changedUser)
    } catch (e) {
        console.error(e);
        res.sendStatus(UNAUTHORIZED);
    }
})

app.get("/quote", (req, res) => {
    let quote = quoteService.getRandomQuote()
    res.json(quote);
    res.end();
})

app.post("/render", (req, res) => {
    let url = req.body.url;
    renderingService.renderPageAsImage(url).then((based64ScreenShot) => {
        res.send(based64ScreenShot);
        res.end();
    }).catch((err) => {
        console.error(err);
        res.error();
    });
})

module.exports = {
    app
}