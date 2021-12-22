"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../Modules/ServerHelper");
var Home = /** @class */ (function () {
    function Home() {
    }
    Home.prototype.GetName = function () {
        return "Home";
    };
    Home.prototype.GetRouter = function () {
        var router = (0, express_1.Router)();
        router.get('/', function (req, res) {
            (0, ServerHelper_1.RenderTemplate)(res, 'Home', "index.ejs");
        });
        return router;
    };
    Home.prototype.GetWebUrl = function () {
        return "/";
    };
    return Home;
}());
exports.Home = Home;
//# sourceMappingURL=Home.js.map