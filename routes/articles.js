const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getSavedArticlesHandler, createArticleHandler, deleteArticleHandler } = require('../controllers/article');
const validateURL = require('../utils/validateURL');

router.get('/', getSavedArticlesHandler);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
    image: Joi.string().required().custom(validateURL),
  }).unknown(true),
}), createArticleHandler);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticleHandler);

module.exports = router;
