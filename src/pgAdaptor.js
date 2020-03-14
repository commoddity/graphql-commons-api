require('dotenv').config();
const pgPromise = require('pg-promise');

const pgp = pgPromise({});

// Development database configuration
const devConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};

// Test database configuration
const testConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.TEST_POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};

const db = process.env.NODE_ENV === 'test' ? pgp(testConfig) : pgp(devConfig);

exports.db = db;
