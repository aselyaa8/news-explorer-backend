const User = require('../models/user');

const getUserProfileHandler = (req, res, next) => {
  // if (!req.params === req.user._id) {
  //   return next(new ForbiddenError('Forbidden request'));
  // }
  // return User.findById(req.params.id)
  //   .then((user) => {
  //     if (user === null) {
  //       next(new NotFoundError('User not found'));
  //     }
  //     return res.send({ user });
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') return next(new BadRequestError('Bad Request'));
  //     return next(err);
  //   });
  console.log('user/me path handler')
}

const userCreateHandler = (req, res) => {
  const { name, email, password } = req.body;
  User.create({ name, email, password })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};
const userLogin = (req, res, next) => {

}
module.exports = {
  getUserProfileHandler,
  userCreateHandler,
  userLogin,
}