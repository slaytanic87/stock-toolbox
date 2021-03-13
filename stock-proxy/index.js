const express = require("express");
const app = express();
const boersennews = require("./boersennews");
const yahoo = require("./yahoo");
const bigdata = require("./bigdata");

let watchlist = require("./watchlist.json");
let indexlist = require("./indexlist.json");
const scraper = require("./lib/scraper.js");
let articles = require("./news.json");

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

app.get("/indexlist", (req, res) => {
    let result = [];
    let promises = [];
    indexlist.forEach((item) => {
        promises.push(new Promise((resolve, reject) => {
            yahoo.indices.fetchIndex(item.symbol, "2m", "1d").then((response) => {
                let indexItem = yahoo.indices.createIndexItem(response.data, item);
                result.push(indexItem);
                resolve();
            }).catch((err) => {
                console.log(err);
                reject(err);
            })
        }));
    });
    Promise.allSettled(promises).then((results) => {
        res.json(result);
        res.end();
    });
})

app.get("/tags", (req, res) => {
    let tags = [];
    watchlist.forEach((item) => {
        tags = tags.concat(item.tags);
    });
    res.json(tags);
    res.end();
})

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
                console.log(err);
                reject(err);
            });
        }));
    });
    Promise.allSettled(promises).then((results) => {
        res.json(result);
        res.end();
    });
})

app.post("/marketIndex", (req, res) => {
    let sym = req.body.symbol;
    yahoo.indices.fetchIndex(sym, "2m", "1d").then((response) => {
        let indexItem = yahoo.indices.createSingleIndexItem(response.data);
        res.json(indexItem);
        res.end();
    }).catch((err) => {
        console.log(err);
        res.error();
    })
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
    let promises = [];
    let parsed = [];
    articles.forEach((article) => {
        if (article.renderingType === "client".toLowerCase()) {
            promises.push(scraper.scrapeCSR(article));
        } else {
            promises.push(scraper.scrape(article));
        }
    });

    Promise.allSettled(promises).then((results) => {
        results.forEach((newsList) => {
            parsed = parsed.concat(newsList.value);
        });
        res.json(parsed);
        res.end();
    });
})

app.get("/calendar", (reqm, res) => {
    boersennews.fetchCalendar(res);
})

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
    let urlBuilder = bigdata.queryBuilder();
    let promises = [];
    let events = [];
    tags.forEach((tag) => {
        let myUrl = urlBuilder
            .subreddit(tag)
            .fields(["url", "author", "title", "subreddit", "created_utc", "media"])
            .after("30d").size(10).build();
        promises.push(bigdata.getSubmission(myUrl))
    })
    Promise.allSettled(promises).then((results) => {
        results.forEach((result) => {
            if (result.value === undefined) {
                return;
            }
            result.value.data.forEach((event) => {
                events.push({
                    author: event.author,
                    tag: event.subreddit,
                    date: new Date(event.created_utc * 1000).toLocaleDateString(),
                    content: event.title,
                    url: event.url,
                    numberOfComments: 0,
                    numberOfSharing: 0,
                    numberOfLikes: 0
                })
            })
        });

        res.json(events);
        res.end();
    });
})
