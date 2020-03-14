// Import database connection object
const { db } = require('../pgAdaptor');

// Re-usable queries. Can be passed table, column and value for flexibility.
// May be used on any table/column.
const queryIfRowExists = async (table, column, value) => {
  try {
    const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column}='${value}')`;
    const [rowQueryResult] = await db.query(query);
    return rowQueryResult.exists;
  } catch (err) {
    console.error(
      `An error occurred while querying whether value exists: ${err}`
    );
  }
};

const queryIfRowContains = async (table, column, value) => {
  try {
    const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} LIKE '%${value}%')`;
    const [rowQueryResult] = await db.query(query);
    return rowQueryResult.exists;
  } catch (err) {
    console.error(
      `An error occurred while querying whether value exists: ${err}`
    );
  }
};

// Specific queries. May only be used in relation to specific tables/columns.
const queryIfEventExists = async (billCode, eventTitle) => {
  try {
    const query = `SELECT EXISTS(SELECT 1 FROM events WHERE bill_code='${billCode}' AND title='${eventTitle}')`;
    const [rowQueryResult] = await db.query(query);
    return rowQueryResult.exists;
  } catch (err) {
    console.error(
      `An error occurred while querying whether event exists: ${err}`
    );
  }
};

const queryLatestParliamentarySession = async () => {
  try {
    const query =
      'SELECT id FROM parliamentary_sessions ORDER BY id DESC LIMIT 1';
    const [sessionQueryResult] = await db.query(query);
    return sessionQueryResult.id;
  } catch (err) {
    console.error(
      `An error occurred while querying latest parliamentary session: ${err}`
    );
  }
};

// Database update queries. These queries modify specific database tables.
const queryUpdateBillPassed = async (billCode, status) => {
  try {
    const query = `UPDATE bills SET passed = '${status}' WHERE code = '${billCode}'`;
    await db.query(query);
    return;
  } catch (err) {
    console.error(
      `An error occurred while updating bill ${billCode}'s status to ${status}: ${err}`
    );
  }
};

const queryUpdateSummaryUrl = async (billCode, summaryUrl) => {
  try {
    const query = `UPDATE bills SET summary_url = '${summaryUrl}' WHERE code = '${billCode}'`;
    await db.query(query);
    return;
  } catch (err) {
    console.error(
      `An error occurred while updating Bill ${billCode}'s summary URL: ${err}`
    );
  }
};

const queryUpdateBillCategory = async (code, categoriesArray) => {
  try {
    const bill = await db.query(`SELECT id FROM bills WHERE code = '${code}'`);
    for (billCategory of categoriesArray) {
      const category = await db.query(
        `SELECT id FROM categories WHERE uclassify_class = '${billCategory}'`
      );
      const query = `INSERT INTO bill_categories (bill_id, category_id, created_at)
                    VALUES ($1, $2, (to_timestamp(${Date.now()} / 1000.0)))`;
      const values = [bill[0].id, category[0].id];
      await db.query(query, values);
      console.log(
        `Successfully added category '${billCategory}' to Bill ${code} ...`
      );
    }
    return;
  } catch (err) {
    console.error(
      `An error occurred whule updating categories for Bill ${code}: ${err}`
    );
  }
};

module.exports = {
  queryIfRowExists,
  queryIfRowContains,
  queryIfEventExists,
  queryLatestParliamentarySession,
  queryUpdateBillPassed,
  queryUpdateSummaryUrl,
  queryUpdateBillCategory
};
