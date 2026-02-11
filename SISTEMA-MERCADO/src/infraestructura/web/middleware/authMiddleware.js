function authMiddleware(req, res, next) {
    if (req.session.administradorId) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

module.exports = authMiddleware;