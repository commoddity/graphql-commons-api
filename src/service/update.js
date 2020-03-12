const { queryUpdateBillPassed } = require('../helpers/queryHelpers');

const updateBillStatus = async (event) => {
  const passed = event.title.includes('Royal Assent');
  const defeated =
    event.title.includes('Defeated') ||
    event.title.includes('Not Proceeded With');
  passed &&
    queryUpdateBillPassed(event.bill_code, true).then(() => {
      console.log(`Bill ${event.bill_code}'s status updated to passed ...`);
    });
  defeated &&
    queryUpdateBillPassed(event.bill_code, false).then(() => {
      console.log(`Bill ${event.bill_code}'s status updated to defeated ...`);
    });
};

module.exports = {
  updateBillStatus
};
