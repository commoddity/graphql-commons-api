const { formatBillWithFetchedData } = require('./format');

// Inserts all fetched data into bills and returns updated bills sorted by date
const insertFetchedData = async (bills) => {
  try {
    // Creates an array of Promises to format all bills with fetched data
    const promises = bills.map(async (bill) => {
      const formattedBill = await formatBillWithFetchedData(bill);
      return new Promise((res, rej) => {
        res(formattedBill);
      }).catch((err) =>
        console.error(
          `Error inserting fetched data into Bill ${bill.code}: ${err}`
        )
      );
    });
    // Resolve promises array into new array of formatted bills
    const formattedBills = await Promise.all(promises);
    return formattedBills.sort((a, b) =>
      a.introduced_date < b.introduced_date ? 1 : -1
    );
  } catch (err) {
    console.error(`Error inserting fetched data into bills: ${err}`);
  }
};

module.exports = { insertFetchedData };
