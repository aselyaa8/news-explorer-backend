const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const getUserProfileHandler = (req, res, next) => {
  if (!req.params === req.user._id) {
    return next(new ForbiddenError('Forbidden request'));
  }
  return User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('User not found'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Bad Request'));
      return next(err);
    });
};

const userCreateHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).then((userExists) => {
    if (userExists) {
      return next(new ConflictError('Conflict, attempt to register a second account with the same email'));
    }
    return bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((user) => {
        res.send({
          _id: user._id,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return next(new BadRequestError(err.message));
        return next(err);
      });
  })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Bad Request'));
      return next(err);
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('email or password should not be empty'));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'default-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports = {
  getUserProfileHandler,
  userCreateHandler,
  userLogin,
};
