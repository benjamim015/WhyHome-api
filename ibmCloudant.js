const Cloudant = require("@cloudant/cloudant");

const cloudant = new Cloudant({
  url:
    "https://ca1f752f-4a4f-438d-8246-7840da8ffd1c-bluemix.cloudantnosqldb.appdomain.cloud",
  plugins: {
    iamauth: { iamApiKey: "x26hK6mbe9VbhZy346ko1EAgrrWnL_ML2KRYXpeBbozu" },
  },
});

module.exports = cloudant;
