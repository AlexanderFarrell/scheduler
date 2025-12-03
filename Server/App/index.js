"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
var express_1 = require("express");
var Index = /** @class */ (function () {
    function Index() {
    }
    Index.prototype.GetName = function () {
        return "Index";
    };
    Index.prototype.GetRouter = function () {
        var router = (0, express_1.Router)();
        router.get('/', function (req, res) {
            if (req.session['username'] != undefined) {
                res.redirect('/home');
            }
            else {
                res.redirect('/auth');
            }
        });
        return router;
    };
    Index.prototype.GetWebUrl = function () {
        return "/";
    };
    return Index;
}());
exports.Index = Index;
//# sourceMappingURL=Index.js.map