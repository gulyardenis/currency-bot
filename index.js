const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/rate", async (req, res) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto("https://www.banki.ru/products/currency/map/moskva/?buttonId=2&officeId=14724&bankId=193364&currencyId=840", { waitUntil: "networkidle2" });

  const rate = await page.$eval(".CurrencyExchangerRate__rate--amount", el => el.textContent.trim());
  await browser.close();
  res.json({ rate: parseFloat(rate.replace(",", ".")) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
