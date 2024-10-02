const User = require('../models/User');
const Category = require("../models/Category");
const PaymentMethod = require("../models/PaymentMethod");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Investment = require("../models/Investment");
const ChartUtil = require("../utils/chart"); 

exports.dashboard = async (req, res) =>{
    const userId = req.user.id;
    const query = req.query;

    try {
        let firstdate, lastdate;
        const currentDate = new Date();
    
        firstdate = new Date();
        firstdate.setDate(currentDate.getDate() - 30);
        lastdate = currentDate;

        const user = await User.findOne({ _id: userId });
        const category = await Category.find({ type: 'Expense' });
        const paymentmethod = await PaymentMethod.find({});
        const incomes = await Income.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate }});
        const expenses = await Expense.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate } });
        const investments = await Investment.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate } });
        const chartconfig = await ChartUtil.createChart(query, userId);
        const categories = category.reduce((acc, item) => {
            if (!Array.isArray(acc[item.subtype]))  acc[item.subtype] = [];

            acc[item.subtype].push(item.name);

            return acc;
        }, {});

        const paymentmethods = paymentmethod.reduce((acc, item) => {
            acc.push(item.name);

            return acc;
        }, []);

        const totalIncome = incomes.reduce((acc, item) => acc+= parseFloat(item.amount), 0);
        const totalExpense = expenses.reduce((acc, item) => acc+= parseFloat(item.price), 0);
        const totalinvestment = investments.reduce((acc, item) => acc+= parseFloat(item.unit_price * item.units), 0);
        const availableBalance = totalIncome - (totalExpense + totalinvestment);

        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let currentdate = `${year}-${month}-${day}`;

        const path = '/dashboard';
        
        res.render("dashboard", { user, categories, paymentmethods, currentdate, path, totalIncome, totalExpense, totalinvestment, availableBalance, chartconfig: JSON.stringify(chartconfig), query });
    } catch (error) {
        res.locals.flash("error", "No profile found");
        console.log(error);
        
        //res.redirect("/login");
    }
}

exports.income = async (req, res) => {
    const userId = req.user.id;
    
    try {
        let firstdate, lastdate;
        const currentDate = new Date();
    
        firstdate = new Date();
        firstdate.setDate(currentDate.getDate() - 30);
        lastdate = currentDate;

        const user = await User.findOne({ _id: userId });
        const category = await Category.find({ type: 'Income' });
        const incomes = (await Income.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate } })).map(item => {
            if (item.date) {
                const dateObj = new Date(item.date);

                const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
                const formattedDate = dateObj.toLocaleDateString('en-US', options);
                item.formattedDate = formattedDate;
                return item;
            }
        });

        const categories = category.reduce((acc, item) => {
            acc.push(item.name);

            return acc;
        }, []);

        const numberOfIncomes = incomes.length;
        let totalIncome = 0;

        if(numberOfIncomes) {
            totalIncome = incomes.reduce((acc, item) => acc+= parseFloat(item.amount), 0);
        }

        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let currentdate = `${year}-${month}-${day}`;

        const path = '/income';
        
        res.locals.flash("success", "");
        res.locals.flash("error", "");
        res.render("income", { user, categories, currentdate, path, incomes, numberOfIncomes, totalIncome });
    } catch (error) {
        res.locals.flash("error", "No profile found");
        res.redirect("/login");
    }
}

exports.expense = async (req, res) => {
    const userId = req.user.id;
    
    try {
        let firstdate, lastdate;
        const currentDate = new Date();
    
        firstdate = new Date();
        firstdate.setDate(currentDate.getDate() - 30);
        lastdate = currentDate;

        const user = await User.findOne({ _id: userId });
        const category = await Category.find({ type: 'Expense' });
        const paymentmethod = await PaymentMethod.find({});
        const expenses = (await Expense.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate } })).map(item => {
            if (item.date) {
                const dateObj = new Date(item.date);

                const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
                const formattedDate = dateObj.toLocaleDateString('en-US', options);
                item.formattedDate = formattedDate;
                return item;
            }
        });
        
        const categories = category.reduce((acc, item) => {
            if (!Array.isArray(acc[item.subtype]))  acc[item.subtype] = [];

            acc[item.subtype].push(item.name);

            return acc;
        }, {});

        const paymentmethods = paymentmethod.reduce((acc, item) => {
            acc.push(item.name);

            return acc;
        }, []);

        const numberOfExpenses = expenses.length;
        let totalExpense = 0;

        if(numberOfExpenses) {
            totalExpense = expenses.reduce((acc, item) => acc+= parseFloat(item.price), 0);
        }

        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let currentdate = `${year}-${month}-${day}`;

        const path = '/expense';
        
        res.render("expense", { user, categories, paymentmethods, currentdate, path, numberOfExpenses, totalExpense, expenses });
    } catch (error) {
        // res.locals.flash("error", "No profile found");
        // res.redirect("/login");
        console.log(error);
        
    }
}

exports.investment = async (req, res) => {
    const userId = req.user.id;
    
    try {
        let firstdate, lastdate;
        const currentDate = new Date();
    
        firstdate = new Date();
        firstdate.setDate(currentDate.getDate() - 30);
        lastdate = currentDate;
        
        const user = await User.findOne({ _id: userId });
        const category = await Category.find({ type: 'Investment' });
        const investments = (await Investment.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate } })).map(item => {
            if (item.date) {
                const dateObj = new Date(item.date);

                const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
                const formattedDate = dateObj.toLocaleDateString('en-US', options);
                item.formattedDate = formattedDate;
                return item;
            }
        });

        const categories = category.reduce((acc, item) => {
            acc.push(item.name);

            return acc;
        }, []);

        const numberOfInvestments = investments.length;
        let totalInvestments = 0;

        if(numberOfInvestments) {
            totalInvestments = investments.reduce((acc, item) => acc+= parseFloat(item.unit_price * item.units), 0);
        }

        const date = new Date();

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let currentdate = `${year}-${month}-${day}`;

        const path = '/investment';
        
        res.render("investment", { user, categories, currentdate, path, numberOfInvestments, totalInvestments, investments });
    } catch (error) {
        res.locals.flash("error", "No profile found");
        res.redirect("/login");
    }
}

exports.addexpense = async (req, res) => {
    const userid = req.user.id;

    const { name, price, date, category, paid_via, notes } = req.body;
    
    try {
        const newExpense = new Expense({ name, userid, price, date, category, paid_via, notes });
        await newExpense.save();
        
        if (req.body.redirect) {
            res.redirect(req.body.redirect);
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
    
}

exports.editexpense = async (req, res) => {
    const userid = req.user.id;
    const expenseid = req.params.id;

    const { name, price, date, category, paid_via, notes } = req.body;
    
    try {
        const result = await Expense.updateOne({ _id: expenseid },{ $set: { name, userid, price, date, category, paid_via, notes } });
        
        if (req.body.redirect) {
            res.redirect(req.body.redirect);
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
    
}

exports.addincome = async (req, res) => {
    const userid = req.user.id;

    const { name, amount, date, category, notes } = req.body;
    
    try {
        const newIncome = new Income({ name, userid, amount, date, category, notes });
        await newIncome.save();
        
        res.locals.flash("success", "Income added successfully.");
        if (req.body.redirect) {
            res.redirect(req.body.redirect);
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
    
}

exports.addinvestment = async (req, res) => {
    const userid = req.user.id;

    const { name, unit_price, units, date, category, notes } = req.body;
    
    try {
        const newInvestment = new Investment({ name, userid, unit_price, units, date, category, notes });
        await newInvestment.save();
        
        if (req.body.redirect) {
            res.redirect(req.body.redirect);
        } else {
            res.redirect("/dashboard");
        }
    } catch (error) {
        console.log(error);
    }
    
}