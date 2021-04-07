const endpoints = require("./adapter/endpoints.js");
const port = 9090;

endpoints.app.listen(port, () => {
    console.log("stock backend is listening at: " + port);
});
