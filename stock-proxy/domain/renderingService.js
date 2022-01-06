const puppeteer = require("puppeteer");

async function renderPageAsImage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const base64Data = await page.screenshot({ encoding: "base64" });
    await browser.close();
    return `data:image/png;base64,${base64Data}`;
}

module.exports = {
    renderPageAsImage
}