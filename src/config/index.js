const { SERVER_ENV } = require('./server.config');

const environment = process.env.NODE_ENV || 'development';

const serverConf = SERVER_ENV[environment];

exports.environment = environment;
exports.serverConf = serverConf;
