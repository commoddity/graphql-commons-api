require('dotenv/config');

const { db } = require('../pgAdaptor');

// Re-usable queries. Can be passed table, column and value for flexibility. May be used on any table.
const queryIfRowExists = async (table, column, value) => {
  try {
    const query = `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column}='${value}')`;
    const [rowQueryResult] = await db.query(query);
    return rowQueryResult.exists;
  } catch (err) {
    console.error(
      `An error occured while querying whether value exists: ${err}`
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
      `An error occured while querying whether value exists: ${err}`
    );
  }
};

//Specific queries. May only be used in relation to specific tables.
const queryIfEventExists = async (billCode, eventTitle) => {
  try {
    const query = `SELECT EXISTS(SELECT 1 FROM events WHERE bill_code='${billCode}' AND title='${eventTitle}')`;
    const [rowQueryResult] = await db.query(query);
    return rowQueryResult.exists;
  } catch (err) {
    console.error(
      `An error occured while querying whether event exists: ${err}`
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
      `An error occured while querying latest parliamentary session: ${err}`
    );
  }
};

module.exports = {
  queryIfRowExists,
  queryIfRowContains,
  queryIfEventExists,
  queryLatestParliamentarySession
};