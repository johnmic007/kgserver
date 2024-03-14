const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const hashString = async (userValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userValue, salt);
  return hashedPassword;
};

const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

const createJWT = (id) => {
  const secretKey = process.env.JWT_SECRET_KEY || "john" ;

  if (!secretKey) {
    throw new Error('JWT secret key is missing. Make sure to set it as an environment variable.');
  }

  return JWT.sign({ userId: id }, secretKey, {
    expiresIn: '1d',
  });
};

module.exports = {
  hashString,
  compareString,
  createJWT,
};
