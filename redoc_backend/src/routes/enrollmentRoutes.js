const { Router } = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middlewares/auth');

const router = Router();

router.use(auth);

router.get('/', enrollmentController.getMyEnrollments);
router.get('/:courseId', enrollmentController.getStatus);
router.post('/:courseId', enrollmentController.enroll);
router.delete('/:courseId', enrollmentController.drop);
router.post('/lessons/:lessonId/complete', enrollmentController.completeLesson);

module.exports = router;
