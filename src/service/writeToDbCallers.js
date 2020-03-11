const { fetchXml } = require('./fetch');
const { formatXml } = require('./format');
const { splitBills, splitEvents } = require('./split');
const { insertFetchedData } = require('./insert');

const fetchLegisinfoDataCaller = async (url) => {
  const xml = await fetchXml(url);
  const sourceArray = formatXml(xml);
  const billsArray = splitBills(sourceArray);
  const eventsArray = splitEvents(sourceArray);
  const formattedBillsArray = await insertFetchedData(billsArray);
  console.log(
    `Succesfully fetched ${formattedBillsArray.length} bills and ${eventsArray.length} events ...`
  );
  return { formattedBillsArray, eventsArray };
};

module.exports = { fetchLegisinfoDataCaller };
