const axios = require("axios");
const express = require("express");
const app = express();
let watchlist = require('./watchlist.json');
const boersennews = require("./boersennews");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(9090);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', (req, res) => {
    let url = req.body.url;
    axios.get(url).then((resp) => {
        console.log(url);
        res.json(resp.data);
        res.end();
    }).catch((error) => {
        console.log(error.response);
    });
});

app.get("/watchlist", (req, res) => {
    res.json(watchlist);
    res.end();
});

app.post("/addStock", (req, res) => {
    let watchStock = req.body;
    console.log(watchStock);
    watchlist.push(watchStock);
})

app.get("/news", (req, res) => {
    boersennews.fetchNews(res);
})
