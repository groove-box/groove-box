var errorController = require(require('path').join(__dirname, '..', 'controllers', 'errorController'));
var router = require('express').Router();

router.use(errorController.notFound);
router.use(errorController.error);

module.exports = router;