const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Income', 'Expense', 'Investment'],
        required: true
    },
    subtype: {
        type: String,
    }
});

module.exports = mongoose.model("Category", CategorySchema);
