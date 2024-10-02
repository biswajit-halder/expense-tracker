const { verifyToken } = require('../utils/jwt');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    res.locals.flash('success', '');
    res.locals.flash('error', '');

    if (!token) return res.render('index' , {name: '', email: '', password: '', confirm_password: ''});

    try {
        const decoded = verifyToken(token);
        
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};
