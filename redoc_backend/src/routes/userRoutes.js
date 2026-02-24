const { Router } = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth); // Todas requieren autenticación

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;