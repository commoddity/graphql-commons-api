const { formatBillWithFetchedData } = require('./format');

const insertFetchedData = async (bills) => {
  try {
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
    const formattedBills = await Promise.all(promises);
    return formattedBills;
  } catch (err) {
    console.error(`Error inserting fetched data into bills: ${err}`);
  }
};

module.exports = { insertFetchedData };
