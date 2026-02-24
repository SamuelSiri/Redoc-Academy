const { Router } = require('express');
const certificateController = require('../controllers/certificateController');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/verify/:code', certificateController.verify);
router.get('/', auth, certificateController.getMyCertificates);
router.post('/:courseId', auth, certificateController.generate);

module.exports = router;
