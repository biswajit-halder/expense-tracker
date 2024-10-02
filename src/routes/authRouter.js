// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const authController = require("../controllers/authController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.get('/', authenticateToken, authController.homepage);
router.get('/login', authController.getlogin);

router.post('/signup', authController.signup);

router.post('/login', authController.postlogin);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login'); 
});

module.exports = router;
