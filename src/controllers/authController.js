const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

exports.homepage = async (req, res) => {
    res.render('dashboard', { username: req.user.userId });
};

exports.signup = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if(password !== confirm_password) {
        res.locals.flash("error", "Password and Confirm Password doesn't match.");
        return res.status(400).render('index', { name, email, password, confirm_password });
    }

    try {
        const user = new User({ name, email, password });
        await user.save();
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (err) {
        res.locals.flash("error", "Error: User already exists or invalid data.");
        return res.status(400).render('index', { name, email, password, confirm_password });
    }
};

exports.getlogin = (req, res) => {
    if(req.user) return redirect("/dashboard");

    res.locals.flash('success', '');
    res.locals.flash('error', '');

    res.render('login');
};

exports.postlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            res.locals.flash("error", "Invalid email or password.");
            return res.status(401).render('login');
        }
      
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        
        res.locals.flash("error", err.message);
        return res.status(400).render('login');
    }
};

