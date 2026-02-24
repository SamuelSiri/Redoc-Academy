const { Router } = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth);

router.get('/', notificationController.getAll);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;
