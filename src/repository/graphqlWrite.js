// DEV NOTE ---> CURRENTLY UNUSED
// DEV NOTE ---> BASICALLY JUST A PLACEHOLDER TO HOLD THE GRAPHQL CODE IN CASE IT WINDS UP BEING USEFUL
// DEV NOTE ---> DELETE WHEN SURE IT WILL NOT BE NEEDED

// const { request } = require('graphql-request');

// const legisinfo_url =
//   'https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149';

// const writeBillsToDatabase = async (billsArray) => {
//   const promises = [];
//   billsArray.forEach((bill) => {
//     const writeBillMutation = `
//         mutation {
//           addBill (
//             parliamentary_session_id: 1,
//             code: "${bill.code}",
//             title: "${bill.title}",
//             description: "${bill.description}",
//             introduced_date: "${bill.introduced_date}",
//             summary_url: "${bill.summary_url}",
//             page_url: "${bill.page_url}",
//             full_text_url: "${bill.full_text_url}",
//             passed: ${bill.passed}
//             )
//           {
//             id
//           }
//         }`;
//     promises.push(request('http://localhost:4000/api', writeBillMutation));
//   });
//   Promise.all(promises).catch((err) =>
//     console.error(
//       `An error occured during the GraphQL request to the API endpoint while adding bills: ${err}`
//     )
//   );
// };

// const writeEventsToDatabase = async (eventsArray) => {
//   const promises = [];
//   eventsArray.forEach((event) => {
//     const writeEventMutation = `
//         mutation {
//           addEvent (
//             bill_code: "${event.bill_code}",
//             title: "${event.title}",
//             publication_date: "${event.publication_date}"
//             ),
//           {
//             id
//           }
//         }`;
//     promises.push(request('http://localhost:4000/api', writeEventMutation));
//   });
//   Promise.all(promises).catch((err) =>
//     console.error(
//       `An error occured during the GraphQL request to the API endpoint while adding events: ${err}`
//     )
//   );
// };
