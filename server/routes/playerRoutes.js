var playerController = require(require('path').join(__dirname, '..', 'controllers', 'playerController'));
var router = require('express').Router();

router.get('/next', playerController.next);
router.get('/stop', playerController.stop);
router.get('/dump', playerController.dump);
router.post('/play', playerController.play);

module.exports = router;