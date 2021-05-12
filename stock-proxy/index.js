const { app } = require("./adapter/endpoints.js");
const splash = require("./lib/splash.js");
const port = 9090;

app.listen(port, () => {
    console.info(splash.get());
    console.info("stock backend is listening at: " + port);
});
