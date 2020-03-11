require('dotenv/config');
const { fetchLegisinfoDataCaller } = require('../service/writeToDbCallers');
const { request } = require('graphql-request');

const legisinfo_url =
  'https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149';

const writeToDatabaseCaller = async () => {
  console.log(`Updating Database at ${new Date()} ...`);
  const { formattedBillsArray, eventsArray } = await fetchLegisinfoDataCaller(
    legisinfo_url
  );
  try {
    await writeBillsToDatabase(formattedBillsArray);
    await writeEventsToDatabase(eventsArray);
    console.log(`Finished Updating Database at: ${new Date()} - Success!`);
  } catch (err) {
    console.error(
      `An error occurred while writing bills and events to database: ${err}`
    );
  }
};

const writeBillsToDatabase = async (billsArray) => {
  billsArray.forEach((bill) => {
    try {
      const writeBillMutation = `
        mutation {
          addBill (
            parliamentary_session_id: 1, 
            code: "${bill.code}", 
            title: "${bill.title}", 
            description: "${bill.description}", 
            introduced_date: "${bill.introduced_date}",
            summary_url: "${bill.summary_url}",
            page_url: "${bill.page_url}",
            full_text_url: "${bill.full_text_url}",
            passed: ${bill.passed}
            ) 
          {
            id
          }
        }`;
      request('http://localhost:4000/api', writeBillMutation);
    } catch (err) {
      console.error(`Error writing Bill ${bill.code}. ${err}`);
    }
  });
};

const writeEventsToDatabase = async (eventsArray) => {
  eventsArray.forEach((event) => {
    try {
      const writeEventMutation = `
        mutation {
          addEvent ( 
            bill_code: "${event.bill_code}", 
            title: "${event.title}", 
            publication_date: "${event.publication_date}"
            ), 
          {
            id
          }
        }`;
      request('http://localhost:4000/api', writeEventMutation);
    } catch (err) {
      console.error(`Error writing event for Bill ${bill.code}. ${err}`);
    }
  });
};

// const writeBillsToDatabase = async (billsArray) => {
//   billsArray.forEach(async (bill) => {
//     const query = `INSERT INTO bills (parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at)
//                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
//     const values = [
//       bill.parliamentary_session_id,
//       bill.code,
//       bill.title,
//       bill.description,
//       bill.introduced_date,
//       bill.summary_url,
//       bill.page_url,
//       bill.full_text_url,
//       bill.passed,
//       new Date()
//     ];
//     db.query(query, values)
//       .then(() => {
//         console.log(`Successfully added Bill ${bill.code} to database ...`);
//       })
//       .catch((err) =>
//         console.error(`Failed to insert Bill ${bill.code}. ${err}`)
//       );
//   });
// };

// const writeEventsToDatabase = async (eventsArray) => {
//   eventsArray.forEach(async (event) => {
//     const query = `INSERT INTO events (bill_id, code, title, publication_date, created_at)
//                   VALUES ($1, $2, $3, $4, $5)`;
//     const values = [
//       event.bill_id,
//       event.code,
//       event.title,
//       event.publication_date,
//       new Date()
//     ];
//     db.query(query, values)
//       .then(() => {
//         console.log(
//           `Successfully added ${event.title} for Bill ${event.code} to database ...`
//         );
//       })
//       .catch((err) =>
//         console.error(
//           `Failed to insert new event for Bill ${event.code}. ${err}`
//         )
//       );
//   });
// };

writeToDatabaseCaller();

module.exports = {
  writeToDatabaseCaller,
  writeBillsToDatabase,
  writeEventsToDatabase
};
