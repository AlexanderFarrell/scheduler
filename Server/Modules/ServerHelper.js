"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupSession = exports.RenderTemplate = exports.IsLoggedIn = exports.SendAsDownload = exports.IsNotNull = exports.MarkdownToHTML = exports.ContainsBodyArgs = void 0;
var session = require("express-session");
var marked_1 = require("marked");
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
function MarkdownToHTML(html) {
    return marked_1.marked.parse(html);
}
exports.MarkdownToHTML = MarkdownToHTML;
function IsNotNull() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args.forEach(function (a) {
        if (a == null) {
            return false;
        }
    });
    return true;
}
exports.IsNotNull = IsNotNull;
function SendAsDownload(res, filename, content) {
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-disposition', "attachment; filename=".concat(filename));
    res.send(content);
}
exports.SendAsDownload = SendAsDownload;
function IsLoggedIn(req, res, next) {
    if (req.session.username != undefined) {
        next();
    }
    else {
        res.redirect('/auth/');
    }
}
exports.IsLoggedIn = IsLoggedIn;
function RenderTemplate(req, res, title, content, data) {
    if (data === void 0) { data = {}; }
    data['title'] = title;
    data['content'] = content;
    data['first_name'] = req.session['first_name'];
    res.render('template.ejs', data);
}
exports.RenderTemplate = RenderTemplate;
function SetupSession(app) {
    app.use(session({
        secret: app.get('config')['session']['secret'],
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    }));
}
exports.SetupSession = SetupSession;
//# sourceMappingURL=ServerHelper.js.map