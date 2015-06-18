var playerController = require(require('path').join(__dirname, '..', 'controllers', 'playerController'));
var router = require('express').Router();

router.post('/next', playerController.next);
router.post('/stop', playerController.stop);
router.post('/play', playerController.play);

module.exports = router;