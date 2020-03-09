const SERVER_ENV = {
  production: {
    SERVER_PORT: process.env.IWIP_SERVER_PORT || 4800
  },
  preproduction: {
    SERVER_PORT: 4800
  },
  development: {
    SERVER_PORT: 4000
  }
};

exports.SERVER_ENV = SERVER_ENV;
