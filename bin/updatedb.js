// load .env data into process.env
require('dotenv').config();

const { writeToDatabaseCaller } = require('../src/repository/postgresWrite');

const legisInfoUrl = process.env.LEGISINFO_URL;

const summariesUrl = process.env.SUMMARY_URL;

// Mapped to 'yarn db:update_database' script in package.json to call database update chain
// DEV NOTE ---> WILL BE ADDED TO SCHEDULED JOB ONCE APP DEPLOYED - EXECUTE EVERY 24 HOURS

writeToDatabaseCaller(legisInfoUrl, summariesUrl);
