const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/rate", async (req, res) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.goto("https://www.banki.ru/products/currency/map/moskva/?buttonId=2&officeId=14724&bankId=193364&currencyId=840", {
    waitUntil: "networkidle2"
  });

  // Находим первый блок с курсами
  const data = await page.evaluate(() => {
    const card = document.querySelector(".CurrencyExchangerRate__ratesBlock");

    if (!card) return { buy: null, sell: null };

    const prices = card.querySelectorAll(".CurrencyExchangerRate__rate--amount");
    if (prices.length < 2) return { buy: null, sell: null };

    const buy = prices[0].textContent.trim().replace(",", ".");
    const sell = prices[1].textContent.trim().replace(",", ".");

    return {
      buy: parseFloat(buy),
      sell: parseFloat(sell)
    };
  });

  await browser.close();

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));

