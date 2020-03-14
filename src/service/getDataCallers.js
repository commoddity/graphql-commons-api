const { fetchXml } = require('./fetch');
const { formatXml } = require('./format');
const { splitBills, splitEvents } = require('./split');
const { insertFetchedData } = require('./insert');

// Handles calling all of the necessary functions to fetch bills and events
// from the LEGISinfo RSS feed of the Canadian parliament
const getLegisInfoCaller = async (url) => {
  const xml = await fetchXml(url);
  const sourceArray = formatXml(xml);
  const billsArray = await splitBills(sourceArray);
  const eventsArray = await splitEvents(sourceArray);
  const formattedBillsArray = await insertFetchedData(billsArray);
  console.log(
    `Succesfully fetched ${formattedBillsArray.length} bills and ${eventsArray.length} events ...\n`
  );
  return { formattedBillsArray, eventsArray };
};
// The returned data from this function is called in the postgresWrite.js
// file in the repository folder to perform database write functions

module.exports = { getLegisInfoCaller };
