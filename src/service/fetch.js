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

const testPageUrl = 'https://parl.ca/DocumentViewer/en/10637457';

const fetchDescription = async (fullTextUrl, billCode) => {
  try {
    const response = await axios.get(fullTextUrl);
    const bill_page = cheerio.load(response.data);
    const summaryDiv = bill_page('div:contains("This enactment")')
      .last()
      .text();
    !summaryDiv &&
      console.log(
        `No description available for Bill ${billCode}. Skipping ...`
      );
    return summaryDiv;
  } catch (err) {
    console.error(
      `An error occurred while fetching description for Bill ${billCode}: ${err}`
    );
  }
};

fetchDescription(testPageUrl);

module.exports = {
  fetchXml,
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription
};
