const bigdata = require("../adapter/bigdata");

function getRedditSubmission(tags) {
    return new Promise((resolve, reject) => {
        let urlBuilder = bigdata.queryBuilder();
        let promises = [];
        let events = [];
        tags.forEach((tag) => {
            let myUrl = urlBuilder
                .subreddit(tag)
                .fields(["url", "author", "title", "subreddit", "created_utc", "media"])
                .after("5d").size(50).build();
            promises.push(bigdata.getSubmission(myUrl));
        });
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
                    });
                });
            });
            resolve(events);
        });
    });
}

module.exports = {
    getRedditSubmission
}