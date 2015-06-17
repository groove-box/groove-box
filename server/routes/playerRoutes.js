var playerController = require(require('path').join(__dirname, '..', 'controllers', 'playerController'));
var router = require('express').Router();

router.post('/play', playerController.play);

module.exports = router;