const { Router } = require('express');
const resourceController = require('../controllers/resourceController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const uploadFile = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const { uploadResourceRules, updateResourceRules } = require('../validators/resourceValidator');
const { ROLES } = require('../utils/constants');

const router = Router();

router.use(auth); // Todas requieren autenticación

// Listar y ver
router.get('/', resourceController.getAll);
router.get('/my-uploads', roleGuard(ROLES.TEACHER, ROLES.ADMIN), resourceController.myUploads);
router.get('/:id', resourceController.getById);
router.get('/:id/download', resourceController.download);

// CRUD (solo teacher/admin)
router.post('/',
  roleGuard(ROLES.TEACHER, ROLES.ADMIN),
  uploadFile('file'),
  uploadResourceRules,
  validate,
  resourceController.upload
);
router.put('/:id',
  roleGuard(ROLES.TEACHER, ROLES.ADMIN),
  updateResourceRules,
  validate,
  resourceController.update
);
router.delete('/:id',
  roleGuard(ROLES.TEACHER, ROLES.ADMIN),
  resourceController.remove
);

module.exports = router;