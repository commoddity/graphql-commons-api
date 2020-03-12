const { fetchXml } = require('./fetch');
const { formatXml } = require('./format');
const { splitBills, splitEvents } = require('./split');
const { insertFetchedData } = require('./insert');

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

module.exports = { getLegisInfoCaller };
