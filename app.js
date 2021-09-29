require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const indexRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(cors());
app.options('*', cors());

app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(indexRouter);

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
