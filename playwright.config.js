const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'file://' + require('path').resolve(__dirname, 'src'),
    headless: true,
    viewport: { width: 1200, height: 900 },
  },
  reporter: 'list',
});
