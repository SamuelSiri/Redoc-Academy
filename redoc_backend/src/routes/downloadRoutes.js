const { Router } = require('express');
const downloadController = require('../controllers/downloadController');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/', auth, downloadController.getMyDownloads);

module.exports = router;
