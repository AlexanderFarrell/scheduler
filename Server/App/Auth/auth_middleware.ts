export function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next()
    } else {
        res.redirect('/auth/login');
    }
}