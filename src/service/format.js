const parser = require('xml2json');
const moment = require('moment');

const {
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription
} = require('./fetch');

// Returns the parsed array of bills/events from the source XML (with redundant tags removed)
const formatXml = (xml) => {
  try {
    const json = parser.toJson(xml);
    const xmlObject = JSON.parse(json);
    const xmlArray = xmlObject.rss.channel.item;
    return xmlArray;
  } catch (err) {
    throw new Error(`Formatting XML to array failed: ${err}`);
  }
};

// Formats the fetched dates to a consistent format
const formatDate = (date) => {
  return moment(date)
    .utcOffset('-0400')
    .format(`YYYY/MM/DD`);
};

// Returns a bill's code from the 'description' field
const formatCode = (description) =>
  description.substr(0, description.indexOf(','));

// Returns the title of a bill or event from the 'description' or 'title' field
const formatTitle = (title) => title.split(/, (.+)/)[1];

// Fetches full text URL, introduced date and description via web scraping
// Inserts values into each bill objects and returns the updated object
const formatBillWithFetchedData = async (bill) => {
  try {
    const fullTextUrl = await fetchFullTextUrl(bill.page_url, bill.code);
    const introducedDate = await fetchIntroducedDate(bill.page_url, bill.code);
    const description = fullTextUrl
      ? await fetchDescription(fullTextUrl, bill.code)
      : undefined;
    bill.full_text_url = fullTextUrl;
    bill.introduced_date = formatDate(introducedDate);
    bill.description = description;
    return bill;
  } catch (err) {
    console.error(`Error formatting bills with fetched data: ${err}`);
  }
};

// Returns an array of matched categories based on the probabilities returned
// Adds categories if they exceed the minThreshold and until the maxThreshold is met
const formatUclassifyData = (probabilityArray) => {
  const maxThreshold = 0.7;
  const minThreshold = 0.15;
  let total_probability = 0;
  const billCategories = [];
  const sortedArray = probabilityArray.sort((a, b) => a.p - b.p).reverse();
  for (category of sortedArray) {
    category.p >= minThreshold && billCategories.push(category.className);
    total_probability += category.p;
    if (total_probability >= maxThreshold) break;
  }
  return billCategories;
};

module.exports = {
  formatXml,
  formatDate,
  formatCode,
  formatTitle,
  formatBillWithFetchedData,
  formatUclassifyData
};
