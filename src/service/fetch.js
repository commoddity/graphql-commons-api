const axios = require('axios');
const cheerio = require('cheerio');
const parser = require('xml2json');

const fetchXml = async (url) => {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    return xml;
  } catch (err) {
    console.error(`An error occurred while fetching XML: ${err}`);
  }
};

const fetchFullTextUrl = async (pageUrl, billCode) => {
  try {
    const response = await axios.get(pageUrl);
    const bill_page = cheerio.load(response.data);
    const link = bill_page('a:contains("Latest Publication")').attr('href');
    const full_text_url = link ? 'https:' + link : undefined;
    !link &&
      console.log(`No full text available for Bill ${billCode}. Skipping ...`);
    return full_text_url;
  } catch (err) {
    console.error(
      `An error occurred while fetching full text url for Bill ${billCode}: ${err}`
    );
  }
};

const fetchIntroducedDate = async (pageUrl, billCode) => {
  try {
    const response = await axios.get(pageUrl);
    const bill_page = cheerio.load(response.data);
    const introducedDateFetch = bill_page(
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

const fetchDescription = async (fullTextUrl, billCode) => {
  try {
    const response = await axios.get(fullTextUrl);
    const bill_page = cheerio.load(response.data);
    const summaryDiv = bill_page('div:contains("This enactment")')
      .last()
      .text();
    return summaryDiv.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error(
      `An error occurred while fetching description for Bill ${billCode}: ${err}`
    );
  }
};

const testUrl =
  'https://www.parl.ca/legisinfo/RSSFeed.aspx?download=rss&Language=E&source=LegislativeSummaryPublications';

const fetchSummaryUrls = async (summariesUrl) => {
  const xml = await fetchXml(summariesUrl);
  const json = parser.toJson(xml);
  const xmlObject = JSON.parse(json);
  const summariesArray = xmlObject.rss.channel.item;
  return summariesArray;
};

const fetchSummaryUrl = async (summaryArray, billCode) => {
  summaryArray.forEach((summary) => {
    if (summary.code === billCode) {
      return summary.url;
    }
  });
};

module.exports = {
  fetchXml,
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription,
  fetchSummaryUrls,
  fetchSummaryUrl
};
