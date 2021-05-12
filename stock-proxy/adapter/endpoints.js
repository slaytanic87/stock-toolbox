const express = require("express");
const app = express();

const watchListService = require("../domain/watchListService.js");
const marketIndexService = require("../domain/marketIndexService.js");
const socialMediaService = require("../domain/socialMediaService.js");
const calendarService = require("../domain/calendarService.js");
const newsService = require("../domain/newsService.js");
const stockDataService = require("../domain/stockDataService.js");
const accountService = require("../domain/accountService.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO implement & replace with real account
let user = {
    username: "testuser",
    password: "mysecret"
}


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/indexlist", (req, res) => {
    marketIndexService.fetchIndexList(user).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    });
})

app.get("/tags", (req, res) => {
    let tags = watchListService.fetchTagsFromWatchList(user);
    res.json(tags);
    res.end();
})

app.get("/v2/watchlist", (req, res) => {
    watchListService.fetchUiWatchList(user).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
})

app.post("/marketIndex", (req, res) => {
    let sym = req.body.symbol;
    marketIndexService.fetchMarketIndexFromApi(sym).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    });
})

app.post("/stock", (req, res) => {
    let range = req.body.range;
    let sym = req.body.sym;
    stockDataService.getStockData(sym, range).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
})

app.post("/addStock", (req, res) => {
    let watchStock = req.body;
    watchListService.insertStock(watchStock, user)
    res.end();
})

app.patch("/removeStock", (req, res) => {
    let watchStock = req.body;
    watchListService.deleteStock(watchStock, user);
    res.end();
})

app.get("/news", (req, res) => {
    newsService.fetchNews(user).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    });
})

app.get("/calendar", (req, res) => {
    calendarService.getCalendar().then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
})

//TODO remove?
app.get("/social", (req, res) => {
    let social = [];
    social.push({
        author: "MC Magga",
        username: "@mcmagga",
        date: new Date().toLocaleDateString(),
        content: "Hello traders!!!",
        url: "https://pbs.twimg.com/media/D3h0Ot3U0AAoX7j?format=jpg&name=large",
        numberOfComments: 0,
        numberOfSharing: 0,
        numberOfLikes: 0
    });
    res.json(social);
    res.end();
})

app.post("/reddit", (req, res) => {
    let tags = req.body;
    socialMediaService.getRedditSubmission(tags).then((events) => {
        res.json(events);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    });
})

app.post("/user/create", (req, res) => {
    let user = req.body;
    let userEntity = accountService.addUser(user.username, user.password);
    res.json(userEntity);
    res.end();
})

app.post("/user/info", (req, res) => {
    let user = req.body;
    let userEntity = accountService.getUser(user.username, user.password);
    res.json(userEntity);
    res.end();
})

module.exports = {
    app
}