"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsLoggedIn = void 0;
function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next();
    }
    else {
        res.redirect('/auth/login');
    }
}
exports.IsLoggedIn = IsLoggedIn;
//# sourceMappingURL=auth_middleware.js.map