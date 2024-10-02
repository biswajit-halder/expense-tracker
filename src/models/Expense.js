const mongoose = require("mongoose");
const Category = require('./Category');
const PaymentMethod = require("./PaymentMethod");

const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        validate: {
            validator: async function(value) {
                const categories = await Category.find().exec();
                const categorynames = categories.map(category => category.name);
                return categorynames.includes(value);
            },
            message: 'Invalid category'
        },
        required: true
    },
    paid_via: {
        type: String,
        validate: {
            validator: async function(value) {
                const paymentmethods = await PaymentMethod.find().exec();
                const methodnames = paymentmethods.map(method => method.name);
                return methodnames.includes(value);
            },
            message: 'Invalid paid_via'
        },
        required: true
    },
    notes: {
        type: String,
    }
});

module.exports = mongoose.model("Expense", ExpenseSchema);
