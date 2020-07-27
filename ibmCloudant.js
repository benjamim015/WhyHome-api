const Cloudant = require("@cloudant/cloudant");

const cloudant = new Cloudant({
  url: process.env.URL,
  plugins: {
    iamauth: { iamApiKey: process.env.IAM_API_KEY },
  },
});

module.exports = cloudant;
