"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupSession = exports.RenderTemplate = exports.IsLoggedIn = exports.ContainsBodyArgs = void 0;
var session = require("express-session");
function ContainsBodyArgs(req, res) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    args.forEach(function (a) {
        if (req.body[a] == undefined) {
            return false;
        }
    });
    return true;
}
exports.ContainsBodyArgs = ContainsBodyArgs;
function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next();
    }
    else {
        res.redirect('/auth/login');
    }
}
exports.IsLoggedIn = IsLoggedIn;
function RenderTemplate(res, title, content, data) {
    if (data === void 0) { data = {}; }
    data['title'] = title;
    data['content'] = content;
    res.render('template.ejs', data);
}
exports.RenderTemplate = RenderTemplate;
function SetupSession(app) {
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }));
}
exports.SetupSession = SetupSession;
//# sourceMappingURL=ServerHelper.js.map