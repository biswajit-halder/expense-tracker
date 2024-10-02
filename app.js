const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require("express-ejs-layouts");
const connectDB = require('./src/config/db');

// Connect to the database
connectDB();

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressLayouts);

app.use((req, res, next) => {
    res.locals.flash = (type, message) => {
      res.locals[`${type}_msg`] = message;
    };
    next();
});

// Templating Engine
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

// Routes
const authRouter = require("./src/routes/authRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");
const apiRouter = require("./src/routes/apiRouter");

app.use(authRouter);
app.use(dashboardRouter);
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, _ => {
    console.log(`Listening to http://localhost:${port}`);
})