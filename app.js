require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const NotFoundError = require('./errors/not-found-error');
const auth = require('./middlewares/auth');
const { userCreateHandler, userLogin } = require('./controllers/user');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.options('*', cors());

app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }).unknown(true),
}), userCreateHandler);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), userLogin);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.NEWS_DB : 'mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => { });
