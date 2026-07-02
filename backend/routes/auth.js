const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { storage } = require('../config/cloudConfig');

// Configure Multer to upload directly to Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB Limit
});

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
