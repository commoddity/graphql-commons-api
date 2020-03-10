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
    !billsArray.some((savedBill) => savedBill.code === bill.code) &&
      billsArray.push(bill);
  });
  return billsArray.sort((a, b) => (a.code > b.code ? 1 : -1));
};

const splitEvents = (array) => {
  const eventsArray = [];
  array.forEach((arrayItem) => {
    const bill = {
      bill_id: undefined,
      code: formatCode(arrayItem.description),
      title: formatTitle(arrayItem.title),
      publication_date: formatDate(arrayItem.pubDate)
    };
    eventsArray.push(bill);
  });
  return eventsArray.sort((a, b) =>
    a.publication_date < b.publication_date ? 1 : -1
  );
};

module.exports = { splitBills, splitEvents };
