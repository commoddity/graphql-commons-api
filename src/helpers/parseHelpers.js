const bodyParser = require('body-parser');

const getHeaderAndParseCookie = (context) => {
  console.log(context.req);
  // return bodyParser.json(req);
};

module.exports = { getHeaderAndParseCookie };
