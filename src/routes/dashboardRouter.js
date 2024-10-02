const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get('/dashboard', authenticateToken, dashboardController.dashboard);
router.get('/income', authenticateToken, dashboardController.income);
router.get('/expense', authenticateToken, dashboardController.expense);
router.get('/investment', authenticateToken, dashboardController.investment);

router.post('/add-expense', authenticateToken, dashboardController.addexpense);
router.post('/add-income', authenticateToken, dashboardController.addincome);
router.post('/add-investment', authenticateToken, dashboardController.addinvestment);

router.post('/edit-expense/:id', authenticateToken, dashboardController.editexpense);
/* router.post('/edit-income/:id', authenticateToken, dashboardController.editincome);
router.post('/edit-investment/:id', authenticateToken, dashboardController.editinvestment); */

module.exports = router;
