const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../validators/authValidator');

const router = Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', auth, authController.me);

// Google OAuth — pass role via state param
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'STUDENT';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: role,
  })(req, res, next);
});
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.googleCallback
);

module.exports = router;
