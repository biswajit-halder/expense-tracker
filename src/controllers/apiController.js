const User = require('../models/User');
const Category = require("../models/Category");
const PaymentMethod = require("../models/PaymentMethod");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Investment = require("../models/Investment");

exports.getexpense = async (req, res) => {
    const expenseid = req.params.id;

    try {
        const expenses = await Expense.findOne({ _id: expenseid });;
        
        res.status(200).json({ check: 'success', expense: expenses});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}

exports.getincome = async (req, res) => {
    const incomeid = req.params.id;

    try {
        const incomes = await Income.findOne({ _id: incomeid });;
        
        res.status(200).json({ check: 'success', income: incomes});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}

exports.getinvestment = async (req, res) => {
    const investmentid = req.params.id;

    try {
        const investments = await Investment.findOne({ _id: investmentid });;
        
        res.status(200).json({ check: 'success', investment: investments});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}

exports.deleteexpense = async (req, res) => {
    const expenseid = req.params.id;

    try {
        await Expense.findByIdAndDelete({ _id: expenseid });
        
        res.status(200).json({ check: 'success'});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}

exports.deleteincome = async (req, res) => {
    const incomeid = req.params.id;

    try {
        await Income.findByIdAndDelete({ _id: incomeid });
        
        res.status(200).json({ check: 'success'});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}

exports.deleteinvestment = async (req, res) => {
    const investmentid = req.params.id;

    try {
        await Investment.findByIdAndDelete({ _id: investmentid });
        
        res.status(200).json({ check: 'success'});
    } catch (error) {
        console.log(error);
        res.status(400).json({ check: 'failure'});
    }
}