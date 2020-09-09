const contentful = require("contentful");
// use default environment config for convenience
// these will be set via `env` property in nuxt.config.js
const config = {
  space: process.env.VUE_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN
};

// export `createClient` to use it in page components
module.exports = {
  createClient() {
    return contentful.createClient(config);
  }
};
