const axios = require("./axios").default;
const flexf = require("./flexf");
const cheerio = require("./cheerio");
const tabletojson = require("./tabletojson");

module.exports = {
  axios: axios,
  flexFetch: flexf,
  cheerio: cheerio,
  tabletojson: tabletojson,
};
