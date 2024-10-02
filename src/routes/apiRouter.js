const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const apiController = require("../controllers/apiController");

const router = express.Router();

router.get('/getexpense/:id', authenticateToken, apiController.getexpense);
router.get('/getincome/:id', authenticateToken, apiController.getincome);
router.get('/getinvestment/:id', authenticateToken, apiController.getinvestment);

router.get('/delete-expense/:id', authenticateToken, apiController.deleteexpense);
router.get('/delete-income/:id', authenticateToken, apiController.deleteincome);
router.get('/delete-investment/:id', authenticateToken, apiController.deleteinvestment);

module.exports = router;