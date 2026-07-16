// Run this to check if live scraping works on your machine:
// node test-scrapers.js

const { testAllScrapers } = require('./scrapers');
testAllScrapers().catch(console.error);
