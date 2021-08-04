const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('inside auth function');
  if (!authorization) {
    return next(new UnauthorizedError('Authorization required'));
  }
  if (!authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization required'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    const key = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'default-key';
    payload = jwt.verify(token, key);
    console.log(payload);
  } catch (err) {
    console.log('1');
    return next(new UnauthorizedError('Authorization required'));
  }
  req.user = payload;
  console.log('2')
  return next();
};
