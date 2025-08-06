const puppeteer = require('puppeteer');

async function scrapeExchangeRates() {
    let browser = null;
    
    try {
        console.log('Launching browser...');
        
        // Launch browser with Replit-compatible settings
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();
        
        // Set viewport and user agent
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        console.log('Navigating to Ardshinbank website...');
        
        // Navigate to the website
        await page.goto('https://ardshinbank.am/?lang=ru', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        console.log('Waiting for exchange rate table to load...');
        
        // Wait for the exchange rate table to be present
        await page.waitForSelector('table', { timeout: 15000 });
        
        // Additional wait to ensure dynamic content is loaded
        await page.waitForTimeout(3000);

        console.log('Extracting exchange rate data...');
        
        // Extract exchange rate data
        const rates = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            let exchangeTable = null;
            
            // Find the table containing exchange rates
            for (let table of tables) {
                const tableText = table.innerText.toLowerCase();
                if (tableText.includes('eur') || tableText.includes('евро') || tableText.includes('rub') || tableText.includes('руб')) {
                    exchangeTable = table;
                    break;
                }
            }
            
            if (!exchangeTable) {
                console.log('Exchange rate table not found');
                return null;
            }
            
            const rows = exchangeTable.querySelectorAll('tr');
            const result = {};
            
            for (let row of rows) {
                const cells = row.querySelectorAll('td, th');
                if (cells.length < 4) continue;
                
                const currencyText = cells[0].innerText.trim().toLowerCase();
                
                // Look for EUR/Euro
                if (currencyText.includes('eur') || currencyText.includes('евро')) {
                    const buyRate = cells[1].innerText.trim();
                    const sellRate = cells[2].innerText.trim();
                    const cbRate = cells[3].innerText.trim();
                    
                    result.eur_buy = buyRate;
                    result.eur_sell = sellRate;
                    result.eur_cb = cbRate;
                }
                
                // Look for RUR/RUB/Ruble
                if (currencyText.includes('rur') || currencyText.includes('rub') || 
                    currencyText.includes('руб') || currencyText.includes('российский')) {
                    const buyRate = cells[1].innerText.trim();
                    const sellRate = cells[2].innerText.trim();
                    const cbRate = cells[3].innerText.trim();
                    
                    result.rur_buy = buyRate;
                    result.rur_sell = sellRate;
                    result.rur_cb = cbRate;
                }
            }
            
            return Object.keys(result).length > 0 ? result : null;
        });

        if (!rates) {
            console.log('No exchange rate data found, trying alternative selectors...');
            
            // Try alternative approach - look for specific currency codes
            const alternativeRates = await page.evaluate(() => {
                const result = {};
                
                // Try to find elements containing currency data
                const allElements = document.querySelectorAll('*');
                const currencyData = [];
                
                for (let element of allElements) {
                    const text = element.innerText;
                    if (text && (text.includes('EUR') || text.includes('RUR') || text.includes('RUB'))) {
                        const parent = element.closest('tr, div, section');
                        if (parent) {
                            currencyData.push({
                                currency: text,
                                parent: parent
                            });
                        }
                    }
                }
                
                // Process found currency data
                for (let data of currencyData) {
                    const parentText = data.parent.innerText;
                    const numbers = parentText.match(/\d+(\.\d+)?/g);
                    
                    if (numbers && numbers.length >= 3) {
                        if (data.currency.includes('EUR')) {
                            result.eur_buy = numbers[0];
                            result.eur_sell = numbers[1];
                            result.eur_cb = numbers[2];
                        } else if (data.currency.includes('RUR') || data.currency.includes('RUB')) {
                            result.rur_buy = numbers[0];
                            result.rur_sell = numbers[1];
                            result.rur_cb = numbers[2];
                        }
                    }
                }
                
                return Object.keys(result).length > 0 ? result : null;
            });
            
            if (alternativeRates) {
                console.log('Successfully extracted rates using alternative method');
                return alternativeRates;
            }
        }

        if (!rates || Object.keys(rates).length === 0) {
            throw new Error('No exchange rate data could be extracted from the website');
        }

        console.log('Successfully extracted exchange rates:', rates);
        return rates;

    } catch (error) {
        console.error('Error during scraping:', error.message);
        throw error;
    } finally {
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed successfully');
            } catch (closeError) {
                console.error('Error closing browser:', closeError.message);
            }
        }
    }
}

module.exports = {
    scrapeExchangeRates
};
