const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    country: 'en-BR'
    // process.env.COUNTRY
  },
  e2e: {
    baseUrl: 'https://commercelayer.github.io/demo-store-core',
    viewportHeight: 1000,
    viewportWidth: 1280,
  },
  // retries: {
  //   runMode: 2,
  //   openMode: 1
  // }
});
