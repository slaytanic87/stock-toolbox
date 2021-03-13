const axios = require("axios");

//https://github.com/pushshift/api
//https://api.pushshift.io/reddit/search/submission/?subreddit=wallstreetbets&fields=url,author,title,subreddit&after=10d&size=200

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getSubmission(url) {
    const randomTimeout = getRandomNumber(200, 900);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.get(url).then((response) => {
                let responseJson = response.data;
                resolve(responseJson);
            }).catch((ex) => {
                console.log("url "+ url + ": " +ex.message);
                reject(ex);
            })
        }, randomTimeout);
    });
}

function queryBuilder() {
    let baseUrl = "https://api.pushshift.io/reddit/search/submission/";
    let queryMap = {};
    return {
        q: function (query) {
            queryMap.q = query;
            return this;
        },
        subreddit: function (subredditName) {
            queryMap.subreddit = subredditName;
            return this;
        },
        fields: function (fieldsArr) {
            let fieldQuery = "";
            fieldsArr.forEach((field) => {
                fieldQuery += field + ",";
            });
            queryMap.fields = fieldQuery.slice(0, -1);
            return this;
        },
        aggs: function (aggArr) {
            let aggQuery = "";
            aggArr.forEach((field) => {
                aggQuery += field + ",";
            });
            queryMap.aggs = aggQuery.slice(0, -1);
            return this;
        },
        after: function (afterTime) {
            queryMap.after = afterTime;
            return this;
        },
        before: function (beforeTime) {
            queryMap.before = beforeTime;
            return this;
        },
        size: function (sizeLimit) {
            queryMap.size = sizeLimit;
            return this;
        },
        build: function () {
            let url = baseUrl;
            let isFirst = true;
            for (let property in queryMap) {
                if (isFirst) {
                    url += `?${property}=${queryMap[property]}`;
                    isFirst = false;
                    continue;
                }
                url += `&${property}=${queryMap[property]}`;
            }
            return url;
        }
    }
}

module.exports = {
    getSubmission,
    queryBuilder
}
