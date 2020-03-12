const { getLegisInfoCaller } = require('../service/writeToDbCallers');
const { updateBillStatus, updateSummaryUrls } = require('../service/update');
const { queryLatestParliamentarySession } = require('../helpers/queryHelpers');

const { db } = require('../pgAdaptor');

const writeToDatabaseCaller = async (legisinfoUrl, summariesUrl) => {
  console.log(`Updating Database at ${new Date()} ...`);
  const { formattedBillsArray, eventsArray } = await getLegisInfoCaller(
    legisinfoUrl
  );
  try {
    await writeBillsToDatabase(formattedBillsArray);
    console.log(`Saved ${formattedBillsArray.length} bills to database ...\n`);
    await writeEventsToDatabase(eventsArray);
    console.log(`Saved ${eventsArray.length} events to database ...\n`);
    await updateSummaryUrls(summariesUrl);
    console.log(`Done checking for legislative summaries ...\n`);
    console.log(`Finished Updating Database at: ${new Date()} - Success!`);
  } catch (err) {
    console.error(
      `An error occurred while writing bills and events to database: ${err}`
    );
  }
};

const writeBillsToDatabase = async (billsArray) => {
  console.log('Saving bills to database ...');
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

const writeEventsToDatabase = async (eventsArray) => {
  console.log('Saving events to database ...');
  const promises = [];
  eventsArray.forEach((event) => {
    const query = `INSERT INTO events (bill_code, title, publication_date, created_at)
                  VALUES ($1, $2, $3, (to_timestamp(${Date.now()} / 1000.0)))`;
    const values = [event.bill_code, event.title, event.publication_date];
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

module.exports = {
  writeToDatabaseCaller,
  writeBillsToDatabase,
  writeEventsToDatabase
};
