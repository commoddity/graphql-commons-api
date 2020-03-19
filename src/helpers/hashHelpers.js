const bcrypt = require('bcrypt');

const hashPassword = async (password) =>
  (hashPwd = await bcrypt.hash(password, 10));

const compareHashPassword = async (password, hash) =>
  (passwordMatch = await bcrypt.compare(password, hash));

exports.hashPassword = hashPassword;
exports.compareHashPassword = compareHashPassword;
