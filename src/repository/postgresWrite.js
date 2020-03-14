const { getLegisInfoCaller } = require('../service/getDataCallers');
const { updateBillStatus, updateSummaryUrls } = require('../service/update');
const { formatUclassifyData } = require('../service/format');
const { fetchFullText, fetchUclassifyData } = require('../service/fetch');
const {
  queryLatestParliamentarySession,
  queryUpdateBillCategory
} = require('../helpers/queryHelpers');

const { db } = require('../pgAdaptor');

// Responsible for calling all of the functions to write fetched bills and events to DB
const writeToDatabaseCaller = async (legisInfoUrl, summariesUrl) => {
  console.log(`Updating Database at ${new Date()} ...`);
  const { formattedBillsArray, eventsArray } = await getLegisInfoCaller(
    legisInfoUrl
  );
  try {
    await writeBillsToDatabase(formattedBillsArray);
    console.log(`Saved ${formattedBillsArray.length} bills to database ...\n`);
    await writeEventsToDatabase(eventsArray);
    console.log(`Saved ${eventsArray.length} events to database ...\n`);
    await updateSummaryUrls(summariesUrl);
    console.log(`Done checking for legislative summaries ...\n`);
    await writeBillCategoriesToDatabase(formattedBillsArray);
    console.log(`Finished Updating Database at: ${new Date()} - Success!`);
  } catch (err) {
    console.error(
      `An error occurred while writing bills and events to database: ${err}`
    );
  }
};

// Executes DB queries to save bills to database
const writeBillsToDatabase = async (billsArray) => {
  console.log('Saving bills to database ...');
  // Gets the latest parliamentary session from the DB
  const parliamentarySession = await queryLatestParliamentarySession();
  const promises = [];
  billsArray.forEach((bill) => {
    const query = `INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (to_timestamp(${Date.now()} / 1000.0)))`;
    const values = [
      parliamentarySession,
      bill.code,
      bill.title,
      bill.description,
      bill.introduced_date,
      bill.summary_url,
      bill.page_url,
      bill.full_text_url,
      bill.passed
    ];
    promises.push(
      db
        .query(query, values)
        .then(() => {
          console.log(`Successfully added Bill ${bill.code} to database ...`);
        })
        .catch((err) =>
          console.error(`Failed to insert Bill ${bill.code}. ${err} ...`)
        )
    );
  });
  return Promise.all(promises).catch((err) =>
    console.error(
      `Failed to add ${billsArray.length} bills to database ... ${err}`
    )
  );
};

// Executes DB queries to save bills to database
const writeEventsToDatabase = async (eventsArray) => {
  console.log('Saving events to database ...');
  const promises = [];
  eventsArray.forEach((event) => {
    const query = `INSERT INTO events (bill_code, title, publication_date, created_at)
                  VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0)))`;
    const values = [event.bill_code, event.title, event.publication_date];
    // Updates related bill's 'passed' column if it has been passed or defeated
    updateBillStatus(event);
    promises.push(
      db
        .query(query, values)
        .then(() => {
          console.log(
            `Successfully added event for Bill ${event.bill_code} to database ...`
          );
        })
        .catch((err) =>
          console.error(
            `Failed to insert event for Bill ${event.bill_code}. ${err} ...`
          )
        )
    );
  });
  return Promise.all(promises).catch((err) =>
    console.error(
      `Failed to add ${eventsArray.length} events to database ... ${err}`
    )
  );
};

// Calls functions to perform the following actions:
// Fetches raw full text for every bill in the current bills array
// Passes the test to uClassify to receive category probabilities
// Executes DB queries to relate these categories to bills
const writeBillCategoriesToDatabase = async (billsArray) => {
  console.log('Saving bill categories from uClassify ...');
  for (bill of billsArray) {
    if (bill.full_text_url) {
      try {
        const fullTextRaw = await fetchFullText(bill.full_text_url);
        const classificationArray = await fetchUclassifyData(fullTextRaw);
        const billCategories = formatUclassifyData(classificationArray);
        await queryUpdateBillCategory(bill.code, billCategories);
      } catch (err) {
        `An error occurred while adding categories to Bill ${bill.code}: ${err}`;
      }
    }
  }
  console.log(`Finished saving categories for ${billsArray.length} bills ...`);
  return;
};

module.exports = {
  writeToDatabaseCaller,
  writeBillsToDatabase,
  writeEventsToDatabase,
  writeBillCategoriesToDatabase
};
