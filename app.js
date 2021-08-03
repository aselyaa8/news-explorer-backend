const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found-error');
const { getSavedArticlesHandler, createArticleHandler, deleteArticleHandler } = require('./controllers/article');
const { getUserProfileHandler, userCreateHandler } = require('./controllers/user');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '60b557968ecce3cbc417c023',
  };
  next();
});

app.post('/signup', userCreateHandler);
app.post('/signin', userLogin);
// # checks the email and password passed in the body
// # and returns a JWT

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

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => { });