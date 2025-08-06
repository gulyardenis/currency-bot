const puppeteer = require("puppeteer");

async function fetchExchangeRates() {
  let browser;
  try {
    console.log("👀 Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    console.log("🌐 Opening Ardshinbank...");
    await page.goto("https://ardshinbank.am/?lang=ru", {
      timeout: 30000,
      waitUntil: "domcontentloaded"
    });

    console.log("⏳ Waiting for table...");
    await page.waitForSelector("table", { timeout: 15000 });

    console.log("📄 Scraping data...");
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

    console.log("✅ Scraping complete:", data);
    return data;
  } catch (err) {
    console.error("❌ Scraper error:", err);
    return { error: "Scraper failed", details: err.message };
  } finally {
    if (browser) {
      console.log("🔒 Closing browser...");
      await browser.close();
    }
  }
}

module.exports = fetchExchangeRates;
