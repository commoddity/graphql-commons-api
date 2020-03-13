const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('xml2json');

// Returns the XML document from a given URL
const fetchXml = async (url) => {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    return xml;
  } catch (err) {
    console.error(`An error occurred while fetching XML: ${err}`);
  }
};

// Returns the latest full text URL from a bill page
const fetchFullTextUrl = async (pageUrl, billCode) => {
  try {
    const response = await axios.get(pageUrl);
    const billPage = cheerio.load(response.data);
    const link = billPage('a:contains("Latest Publication")').attr('href');
    const fullTextUrl = link ? 'https:' + link : undefined;
    !link &&
      console.log(`No full text available for Bill ${billCode}. Skipping ...`);
    return fullTextUrl;
  } catch (err) {
    console.error(
      `An error occurred while fetching full text url for Bill ${billCode}: ${err}`
    );
  }
};

// Returns the date that a bill was introduced from a bill page
const fetchIntroducedDate = async (pageUrl, billCode) => {
  try {
    const response = await axios.get(pageUrl);
    const billPage = cheerio.load(response.data);
    const introducedDateFetch = billPage(
      'div:contains("Introduction and First Reading")'
    )
      .last()
      .parent()
      .parent()
      .find('span')
      .text();
    const introducedDate = introducedDateFetch
      ? introducedDateFetch
      : undefined;
    !introducedDate &&
      console.log(
        `No introduced date available for Bill ${billCode}. Skipping ...`
      );
    return introducedDate;
  } catch (err) {
    console.error(
      `An error occurred while fetching introduced date for Bill ${billCode}: ${err}`
    );
  }
};

// Returns the description from the summary of the full text of a given bill
const fetchDescription = async (fullTextUrl, billCode) => {
  try {
    const response = await axios.get(fullTextUrl);
    const billPage = cheerio.load(response.data);
    const summaryDiv = billPage('div:contains("This enactment")')
      .last()
      .text();
    // Regex removes trailing space and newline characters
    return summaryDiv.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error(
      `An error occurred while fetching description for Bill ${billCode}: ${err}`
    );
  }
};

// Returns the array of legislative summaries of bills from the parliament website
const fetchSummaryUrls = async (summariesUrl) => {
  try {
    const xml = await fetchXml(summariesUrl);
    const json = parser.toJson(xml);
    const xmlObject = JSON.parse(json);
    const summariesArray = xmlObject.rss.channel.item;
    return summariesArray;
  } catch (err) {
    console.error(
      `An error occurred while fetching the legislative summary feed: ${err}`
    );
  }
};

const fetchFullText = async (fullTextUrl, billCode) => {
  try {
    const response = await axios.get(fullTextUrl);
    const fullTextPage = cheerio.load(response.data);
    const xmlPageLink = fullTextPage('a.btn-export-xml:contains("XML")').attr(
      'href'
    );
    const fullTextUrlJoined = 'https://www.parl.ca' + xmlPageLink;
    const fullTextXml = await fetchXml(fullTextUrlJoined);
    const fullTextRaw = cheerio
      .load(fullTextXml)('text')
      .text();
    return fullTextRaw;
  } catch (err) {
    console.error(
      `An error occurred while fetching full text of Bill ${billCode}: ${err}`
    );
  }
};

module.exports = {
  fetchXml,
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription,
  fetchSummaryUrls,
  fetchFullText
};
