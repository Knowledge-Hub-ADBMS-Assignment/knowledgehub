const bcrypt = require("bcrypt");

const generateHash = (password) => {
  return bcrypt.hashSync(password, 10);
};
const isValidPassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { generateHash, isValidPassword };
