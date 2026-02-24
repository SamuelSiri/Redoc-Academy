const { Router } = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth);

router.post('/', messageController.send);
router.get('/inbox', messageController.getInbox);
router.get('/sent', messageController.getSent);
router.get('/:id', messageController.getById);
router.post('/:id/reply', messageController.reply);
router.delete('/:id', messageController.remove);
router.patch('/:id/read', messageController.markAsRead);

module.exports = router;
