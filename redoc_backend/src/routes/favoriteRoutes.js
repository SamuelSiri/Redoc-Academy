const { Router } = require('express');
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth);

router.get('/', favoriteController.getMyFavorites);
router.get('/check/:resourceId', favoriteController.check);
router.post('/:resourceId', favoriteController.add);
router.delete('/:resourceId', favoriteController.remove);

module.exports = router;
