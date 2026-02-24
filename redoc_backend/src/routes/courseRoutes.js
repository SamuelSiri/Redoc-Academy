const { Router } = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = Router();

router.get('/', courseController.getAll);
router.get('/my-courses', auth, roleGuard('TEACHER', 'ADMIN'), courseController.getMyCourses);
router.get('/:id', courseController.getById);
router.post('/', auth, roleGuard('TEACHER', 'ADMIN'), courseController.create);
router.put('/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.update);
router.delete('/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.remove);

// Modules
router.post('/:id/modules', auth, roleGuard('TEACHER', 'ADMIN'), courseController.createModule);
router.put('/modules/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.updateModule);
router.delete('/modules/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.deleteModule);

// Lessons
router.post('/modules/:id/lessons', auth, roleGuard('TEACHER', 'ADMIN'), courseController.createLesson);
router.put('/lessons/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.updateLesson);
router.delete('/lessons/:id', auth, roleGuard('TEACHER', 'ADMIN'), courseController.deleteLesson);

module.exports = router;
