const parser = require('xml2json');
const moment = require('moment');

const formatXml = (xml) => {
  try {
    const json = parser.toJson(xml);
    const xmlObject = JSON.parse(json);
    const billsArray = xmlObject.rss.channel.item;
    return billsArray;
  } catch (err) {
    throw new Error(`Formatting XML to array failed: ${err}`);
  }
};

const formatDate = (date) => {
  const parsedDate = new Date(date);
  return moment(parsedDate)
    .utcOffset('-0400')
    .format(`YYYY-MM-DD`);
};

const formatCode = (description) =>
  description.substr(0, description.indexOf(','));

const formatTitle = (title) => title.split(/, (.+)/)[1];

module.exports = { formatXml, formatDate, formatCode, formatTitle };
