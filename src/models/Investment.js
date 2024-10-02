const mongoose = require("mongoose");
const Category = require('./Category');

const InvestmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    userid: {
        type: String,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    units: {
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
    notes: {
        type: String,
    }
});

module.exports = mongoose.model("Investment", InvestmentSchema);
