const { formatDate, formatCode, formatTitle } = require('./format');

const splitBills = (array) => {
  const billsArray = [];
  array.forEach((arrayItem) => {
    const bill = {
      parliamentary_session_id: undefined,
      code: formatCode(arrayItem.description),
      title: formatTitle(arrayItem.description),
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url: arrayItem.link,
      full_text_url: undefined,
      passed: null
    };
    if (!billsArray.some((savedBill) => savedBill.code === bill.code)) {
      billsArray.push(bill);
    }
  });
  return billsArray
    .sort((a, b) => (a.introduced_date > b.introduced_date ? 1 : -1))
    .sort((a, b) => (a.code > b.code ? 1 : -1));
};

const splitEvents = (array) => {
  const eventsArray = [];
  array.forEach((arrayItem) => {
    const event = {
      bill_code: formatCode(arrayItem.description),
      title: formatTitle(arrayItem.title),
      publication_date: formatDate(arrayItem.pubDate)
    };
    eventsArray.push(event);
  });
  return eventsArray;
};

module.exports = { splitBills, splitEvents };
