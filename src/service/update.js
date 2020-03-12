const {
  queryIfRowExists,
  queryUpdateBillPassed,
  queryUpdateSummaryUrl
} = require('../helpers/queryHelpers');
const { fetchSummaryUrls } = require('./fetch');
const { splitSummaries } = require('./split');

const updateBillStatus = async (event) => {
  const passed = event.title.includes('Royal Assent');
  const defeated =
    event.title.includes('Defeated') ||
    event.title.includes('Not Proceeded With');
  passed &&
    queryUpdateBillPassed(event.bill_code, true).then(() => {
      console.log(`Bill ${event.bill_code}'s status updated to passed ...`);
    });
  defeated &&
    queryUpdateBillPassed(event.bill_code, false).then(() => {
      console.log(`Bill ${event.bill_code}'s status updated to defeated ...`);
    });
};

const updateSummaryUrls = async (url) => {
  console.log('Checking for published legislative summaries ...');
  const summariesArray = await fetchSummaryUrls(url);
  const summariesObjectsArray = splitSummaries(summariesArray);
  for (summary of summariesObjectsArray) {
    try {
      const billExistsInDatabase = await queryIfRowExists(
        'bills',
        'code',
        summary.code
      );
      billExistsInDatabase &&
        (await queryUpdateSummaryUrl(summary.code, summary.url));
      console.log(
        `Legislative summary published for Bill ${summary.code}. Summary URL added ...`
      );
    } catch (err) {
      console.error(
        `An error occured while adding a summary URL to Bill ${summary.code}: ${err}`
      );
    }
  }
  return;
};

module.exports = {
  updateBillStatus,
  updateSummaryUrls
};
