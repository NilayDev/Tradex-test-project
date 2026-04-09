const { Router } = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
