const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const getSavedArticlesHandler = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
}

const createArticleHandler = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      console.log(err);
      //chanhe it
      //
      //
    })
}

const deleteArticleHandler = (req, res, next) => {

  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        return next(new NotFoundError('Article not found'));
      }
      if (article.owner.toString() === req.user._id) {
        return Article.findByIdAndRemove(req.params.articleId)
          .then((removedArticle) => {
            if (removedArticle === null) {
              return next(new NotFoundError('Article not found'));
            }
            return res.send(removedArticle);
          })
          .catch((err) => {
            if (err.name === 'CastError') return next(new BadRequestError('Bad Request'));
            return next(err);
          });
      }
      return next(new ForbiddenError('Forbidden request'));
    })
    .catch((err) => {
      if (err.name === 'CastError') return next(new BadRequestError('Bad Request'));
      return next(err);
    });

}

module.exports = {
  getSavedArticlesHandler, createArticleHandler, deleteArticleHandler
};