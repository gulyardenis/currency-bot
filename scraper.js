const puppeteer = require("puppeteer");

async function fetchExchangeRates() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("https://ardshinbank.am/?lang=ru", { timeout: 30000, waitUntil: "domcontentloaded" });

    // Подожди пока появится таблица (можно уточнить селектор)
    await page.waitForSelector("table", { timeout: 10000 });

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tbody tr");
      const result = {};
      rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const currency = cells[0]?.innerText.trim();
        const sell = cells[2]?.innerText.trim();
        if (currency && sell) {
          result[currency] = sell;
        }
      });
      return result;
    });

    return data;
  } catch (err) {
    console.error("Scraper error:", err);
    return { error: "Scraper failed", details: err.message };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = fetchExchangeRates;
