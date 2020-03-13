const { formatDate, formatCode, formatTitle } = require('./format');
const {
  queryIfRowExists,
  queryIfEventExists
} = require('../helpers/queryHelpers');

// Splits out the bills from the LEGISinfo RSS feed of all bill events
// It also performs some validations to prevent duplicate bills
const splitBills = async (array) => {
  const billsArray = [];
  for (arrayItem of array) {
    const billCode = formatCode(arrayItem.description);
    const bill = {
      parliamentary_session_id: undefined,
      code: billCode,
      title: formatTitle(arrayItem.description),
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url: arrayItem.link,
      full_text_url: undefined,
      passed: null
    };
    // Returns true if bill already has been saved to billsArray this update
    const billExistsInArray = billsArray.some(
      (savedBill) => savedBill.code === bill.code
    );
    // Returns true if bill has already been saved to database in a previous update
    const billExistsinDb = await queryIfRowExists('bills', 'code', billCode);
    if (!billExistsInArray && !billExistsinDb) {
      console.log(
        `Successfuly fetched Bill ${bill.code} from LEGISinfo server ...`
      );
      billsArray.push(bill);
    } else if (billExistsinDb) {
      console.log(`Bill ${bill.code} already exists. Skipping ...`);
    }
  }
  return billsArray;
};

// Splits out the events from the LEGISinfo RSS feed of all bill events
// It also performs some validations to prevent duplicate events
const splitEvents = async (array) => {
  const eventsArray = [];
  for (arrayItem of array) {
    const billCode = formatCode(arrayItem.description);
    const eventTitle = formatTitle(arrayItem.title);
    const event = {
      bill_code: billCode,
      title: eventTitle,
      publication_date: formatDate(arrayItem.pubDate)
    };
    // Returns true if event for bill has already been saved to database in a previous update
    const eventExists = await queryIfEventExists(billCode, eventTitle);
    if (!eventExists) {
      eventsArray.push(event);
      console.log(
        `Successfully fetched ${event.title} for Bill ${event.bill_code} from LEGISinfo server ...`
      );
    } else {
      console.log(
        `${event.title} for Bill ${event.bill_code} already exists. Skipping ...`
      );
    }
  }
  return eventsArray;
};

// Splits out the code of the bill from each legislative summary in the array
// Returns an array of summary objects containing only the bill code and summary url
const splitSummaries = (array) => {
  const summariesArray = [];
  array.forEach((summary) => {
    const summaryBillCode = summary.title.includes(
      'Legislative Summary Published for '
    )
      ? summary.title
          .split('Legislative Summary Published for ')[1]
          .split(',')[0]
      : summary.title
          .split('Legislative Short Summary Published for ')[1]
          .split(',')[0];
    const summaryObject = {
      code: summaryBillCode,
      url: summary.link
    };
    summariesArray.push(summaryObject);
  });
  return summariesArray;
};

module.exports = { splitBills, splitEvents, splitSummaries };
