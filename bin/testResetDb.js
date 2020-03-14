// load .env data into process.env
require('dotenv').config();

// other dependencies
const fs = require('fs');
const Client = require('pg-native');

// PG connection setup
const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:${process.env.POSTGRES_PORT}/${process.env.TEST_POSTGRES_DB}`;
const client = new Client();

// Loads the schema files from db/schema
const runSchemaFiles = function() {
  console.log(`-> TEST DATABASE RESET -> Loading Schema Files ...`);
  const schemaFilenames = fs.readdirSync('./db/psql/schema');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/psql/schema/${fn}`, 'utf8');
    console.log(`\t-> TEST DATABASE RESET -> Running ${fn}`);
    client.querySync(sql);
  }
};

const runSeedFiles = function() {
  console.log(`-> TEST DATABASE RESET -> Loading Seeds ...`);
  const schemaFilenames = fs.readdirSync('./db/psql/seeds');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/psql/seeds/${fn}`, 'utf8');
    console.log(`\t-> TEST DATABASE RESET -> Running ${fn}`);
    client.querySync(sql);
  }
};

try {
  console.log(
    `-> TEST DATABASE RESET -> Connecting to PG using ${connectionString} ...`
  );
  client.connectSync(connectionString);
  runSchemaFiles();
  runSeedFiles();
  client.end();
} catch (err) {
  console.error(`Failed due to error: ${err}`);
  client.end();
}
