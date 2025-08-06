const express = require('express');
const fetchExchangeRates = require("./scraper");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Ardshinbank Exchange Rate Scraper API',
        endpoints: {
            rates: '/rate'
        }
    });
});

// Exchange rates endpoint
app.get('/rate', async (req, res) => {
    try {
        console.log('Starting exchange rate scraping...');
        const rates = await fetchExchangeRates();
        
        if (!rates) {
            return res.status(500).json({
                error: 'Failed to scrape exchange rates',
                message: 'Unable to extract rate data from the website'
            });
        }

        console.log('Successfully scraped rates:', rates);
        res.json(rates);
    } catch (error) {
        console.error('Error scraping exchange rates:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch exchange rates',
            details: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET / - Health check');
    console.log('  GET /rate - Exchange rates');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
