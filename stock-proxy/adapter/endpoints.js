const express = require("express");
const app = express();

const watchListService = require("../domain/watchListService.js");
const marketIndexService = require("../domain/marketIndexService.js");
const socialMediaService = require("../domain/socialMediaService.js");
const calendarService = require("../domain/calendarService.js");
const newsService = require("../domain/newsService.js");
const stockDataService = require("../domain/stockDataService.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/indexlist", (req, res) => {
    marketIndexService.getIndexList().then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    });
})

app.get("/tags", (req, res) => {
    let tags = watchListService.getTagsFromWatchList();
    res.json(tags);
    res.end();
})

app.get("/v2/watchlist", (req, res) => {
    watchListService.getWatchlist().then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
})

app.post("/marketIndex", (req, res) => {
    let sym = req.body.symbol;
    marketIndexService.getMarketIndex(sym).then((result) => {
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
    console.log(watchStock);
    watchListService.addStock(watchStock);
    res.end();
})

app.patch("/removeStock", (req, res) => {
    let watchStock = req.body;
    watchListService.removeStock(watchStock)
    res.end();
})

app.get("/news", (req, res) => {
    newsService.getNews().then((result) => {
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

module.exports = {
    app
}