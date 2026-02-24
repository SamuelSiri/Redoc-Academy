const { Router } = require('express');
const statsController = require('../controllers/statsController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');

const router = Router();

router.use(auth);

router.get('/student', statsController.getStudentStats);
router.get('/teacher', roleGuard('TEACHER', 'ADMIN'), statsController.getTeacherStats);
router.get('/admin', roleGuard('ADMIN'), statsController.getAdminStats);

module.exports = router;
