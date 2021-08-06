const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');
const { userCreateHandler, userLogin } = require('../controllers/user');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }).unknown(true),
}), userCreateHandler);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), userLogin);

router.use(auth);

router.use('/users', require('./users'));
router.use('/articles', require('./articles'));

router.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
