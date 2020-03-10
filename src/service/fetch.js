const axios = require('axios');
const cheerio = require('cheerio');

const fetchXml = async (url) => {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    return xml;
  } catch (err) {
    console.error(`An error occurred while fetching XML: ${err}`);
  }
};

module.exports = { fetchXml };
