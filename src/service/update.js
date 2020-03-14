const {
  queryIfRowExists,
  queryUpdateBillPassed,
  queryUpdateSummaryUrl
} = require('../helpers/queryHelpers');
const { fetchSummaryUrls } = require('./fetch');
const { splitSummaries } = require('./split');

// Checks if each bill event contains specific words
// These words indicate if the bill has been passed or defeated
const updateBillStatus = async (event) => {
  const passed = event.title.includes('Royal Assent');
  const defeated =
    event.title.includes('Defeated') ||
    event.title.includes('Not Proceeded With');
  // Function executes database queries to update the status of the database field
  passed &&
    queryUpdateBillPassed(event.bill_code, true)
      .then(() => {
        console.log(`Bill ${event.bill_code}'s status updated to passed ...`);
        return;
      })
      .catch((err) => {
        console.error(
          `An error occurred while attempting to update ${event.bill_code}'s status to passed: ${err}`
        );
      });
  defeated &&
    queryUpdateBillPassed(event.bill_code, false)
      .then(() => {
        console.log(`Bill ${event.bill_code}'s status updated to defeated ...`);
        return;
      })
      .catch((err) => {
        console.error(
          `An error occurred while attempting to update ${event.bill_code}'s status to defeated: ${err}`
        );
      });
};

// Checks if the bill studied by each legislative summary is in the database
// Updates 'summary_url' field in database in a legislative summary has been published
const updateSummaryUrls = async (url) => {
  console.log('Checking for published legislative summaries ...');
  const summariesArray = await fetchSummaryUrls(url);
  const summariesObjectsArray = splitSummaries(summariesArray);
  for (summary of summariesObjectsArray) {
    try {
      // Returns true if bill exists in database
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
        `An error occurred while adding a summary URL to Bill ${summary.code}: ${err}`
      );
    }
  }
  return;
};

module.exports = {
  updateBillStatus,
  updateSummaryUrls
};
