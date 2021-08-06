const router = require('express').Router();
const { getUserProfileHandler } = require('../controllers/user');

router.get('/me', getUserProfileHandler);

module.exports = router;
