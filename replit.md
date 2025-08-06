# Ardshinbank Exchange Rate Scraper API

## Overview

This project is a Node.js web scraping application that extracts exchange rate data from Ardshinbank's website and exposes it through a REST API. The application uses Puppeteer for web scraping and Express.js for the web server, providing real-time currency exchange rates in a structured JSON format.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Express.js server providing RESTful API endpoints
- **Web Scraping Engine**: Puppeteer with headless Chrome browser for automated data extraction
- **Server Configuration**: Single-process architecture optimized for containerized environments (Replit)
- **Error Handling**: Comprehensive try-catch blocks with detailed error responses and logging

### API Design
- **REST Endpoints**: 
  - Health check endpoint (`/`) for service status monitoring
  - Exchange rates endpoint (`/rate`) for currency data retrieval
- **Response Format**: Structured JSON responses with consistent error handling
- **CORS Support**: Cross-origin resource sharing enabled for web client access

### Web Scraping Strategy
- **Target Site**: Ardshinbank's official website (Russian language version)
- **Browser Configuration**: Headless Chrome with security flags for cloud deployment compatibility
- **Data Extraction**: DOM parsing to locate and extract exchange rate tables
- **Reliability Features**: Network idle waiting, timeout handling, and viewport configuration for consistent scraping

### Deployment Architecture
- **Environment**: Optimized for Replit and similar cloud platforms
- **Browser Args**: Configured with `--no-sandbox`, `--disable-setuid-sandbox`, and other flags for containerized environments
- **Process Management**: Single-process mode to minimize resource usage
- **Port Configuration**: Dynamic port assignment with fallback to 8000

## External Dependencies

### Core Dependencies
- **Express.js (^5.1.0)**: Web framework for API server and routing
- **Puppeteer (^24.15.0)**: Headless Chrome automation for web scraping

### Target Website
- **Ardshinbank Website**: Primary data source at `https://ardshinbank.am/?lang=ru`
- **Data Structure**: HTML table-based exchange rate information
- **Update Frequency**: Real-time scraping on API request

### Browser Dependencies
- **Chromium**: Automatically managed by Puppeteer for headless browsing
- **User Agent**: Configured to mimic standard Chrome browser for compatibility