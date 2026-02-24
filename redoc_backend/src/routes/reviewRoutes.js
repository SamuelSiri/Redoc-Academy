const { Router } = require('express');
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/auth');

const router = Router();

router.get('/course/:courseId', reviewController.getCourseReviews);
router.post('/:courseId', auth, reviewController.create);
router.delete('/:courseId', auth, reviewController.remove);

module.exports = router;
