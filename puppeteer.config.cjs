const { join } = require('path');

module.exports = {
  defaultBrowserOptions: {
    executablePath: join(
      '/opt',
      'render',
      '.cache',
      'puppeteer',
      'chrome',
      'linux-138.0.7204.168',
      'chrome'
    ),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  cacheDirectory: join(__dirname, '.cache', 'puppeteer')
};
