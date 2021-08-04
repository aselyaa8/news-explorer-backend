const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found-error');
const auth = require('./middlewares/auth');
const { getSavedArticlesHandler, createArticleHandler, deleteArticleHandler } = require('./controllers/article');
const { getUserProfileHandler, userCreateHandler, userLogin } = require('./controllers/user');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/signup', userCreateHandler);
app.post('/signin', userLogin);
// # checks the email and password passed in the body
// # and returns a JWT

app.use(auth);

app.get('/users/me', getUserProfileHandler);
app.get('/articles', getSavedArticlesHandler);
app.post('/articles', createArticleHandler);
app.delete('/articles/:articleId', deleteArticleHandler);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
})

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => { });