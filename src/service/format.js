const parser = require('xml2json');
const moment = require('moment');

const {
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription
} = require('./fetch');

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

const formatDate = (date) => {
  return moment(date)
    .utcOffset('-0400')
    .format(`YYYY/MM/DD`);
};

const formatCode = (description) =>
  description.substr(0, description.indexOf(','));

const formatTitle = (title) => title.split(/, (.+)/)[1];

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

module.exports = {
  formatXml,
  formatDate,
  formatCode,
  formatTitle,
  formatBillWithFetchedData
};
