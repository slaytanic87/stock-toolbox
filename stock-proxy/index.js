var axios = require("axios");
var express = require("express");
var app = express();
var watchlist = require('./watchlist.json');


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
        console.log(error.response.statusText);
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