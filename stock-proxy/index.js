const axios = require("axios");
const express = require("express");
const app = express();
let watchlist = require('./watchlist.json');
const boersennews = require("./boersennews");
const yahoo = require("./yahoo");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 9090;

app.listen(port, ()=> {
    console.log("stock backend is listening at: " + 9090);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/watchlist", (req, res) => {
    res.json(watchlist);
    res.end();
});

app.get("/v2/watchlist", (req, res) => {
    let result = [];
    let promises = [];
    watchlist.forEach((item) => {
        promises.push(new Promise((resolve, reject) => {
            yahoo.fetchStockData(item.name, "1mo").then((response) => {
                let watchItem = yahoo.createWatchItem(item, response.data);
                result.push(watchItem);
                resolve();
            }).catch((err)=> {
                reject(err);
            });
        }));
    });
    Promise.allSettled(promises).then((results) => {
        res.json(result);
        res.end();
    });
})

app.post("/stock", (req, res) => {
    let range = req.body.range;
    let sym = req.body.sym;
    yahoo.fetchStockData(sym, range).then((response)=> {
        let watchItem = yahoo.mapChartDataFromResponse(response.data);
        res.json(watchItem);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
})

app.post("/addStock", (req, res) => {
    let watchStock = req.body;
    console.log(watchStock);
    watchlist.push(watchStock);
})

app.get("/news", (req, res) => {
    boersennews.fetchNews(res);
})

app.get("/calendar", (reqm, res) => {
    boersennews.fetchCalendar(res);
})
