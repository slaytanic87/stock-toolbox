const puppeteer = require("puppeteer");

const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36";

async function renderPageAsImage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto(url, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
    });
    const base64Data = await page.screenshot({ encoding: "base64" });
    await browser.close();
    return `data:image/png;base64,${base64Data}`;
}

module.exports = {
    renderPageAsImage
}
