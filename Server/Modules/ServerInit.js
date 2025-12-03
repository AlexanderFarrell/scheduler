"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInit = void 0;
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var enforce = require("express-sslify");
var Database_1 = require("./Database");
var fs = require("fs");
var ServerHelper_1 = require("./ServerHelper");
// Initializes an express app with boilerplate code, such as a database, static file server, sessions, etc.
var ServerInit = /** @class */ (function () {
    function ServerInit() {
    }
    ServerInit.GetExpressApp = function () {
        var runtime_mode = process.env.RUNTIME_MODE || 'production';
        if (process.argv.includes("--debug")) {
            runtime_mode = "development";
        }
        console.log(runtime_mode);
        var app = express();
        app.set('views', path.join(__dirname, '../../Client/View'));
        app.set('view engine', 'ejs');
        app.set("runtime_mode", runtime_mode);
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../../Client/Public')));
        switch (runtime_mode) {
            case 'production_heroku':
                app.use(enforce.HTTPS({ trustProtoHeader: true }));
                app.use(helmet({
                    contentSecurityPolicy: {
                        directives: __assign(__assign({}, helmet.contentSecurityPolicy.getDefaultDirectives()), { "script-src": ["'self'", "https://assets.calendly.com"], "object-src": ["'self'", "https://wakatime.com"], "img-src": ["'self'", "https://img.itch.zone"], "style-src": ["'self'", "https://cdn.jsdelivr.net/gh/devicons/"] })
                    }
                }));
                (0, Database_1.SetupDatabaseProductionHeroku)();
                break;
            case 'production':
                // @ts-ignore
                var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Server.config.json')));
                app.set('config', config);
                (0, Database_1.SetupDatabaseProduction)(config);
                (0, ServerHelper_1.SetupSession)(app);
                break;
            case 'development':
                // @ts-ignore
                var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Server.config.json')));
                app.set('config', config);
                (0, Database_1.SetupDatabaseDevelopment)(config);
                (0, ServerHelper_1.SetupSession)(app);
                break;
            default:
                throw new Error("Unknown runtime mode set: ".concat(runtime_mode));
        }
        return app;
    };
    ServerInit.Run = function (app) {
        var _a, _b, _c;
        var port = process.env.PORT || ((_a = app.get('config')) === null || _a === void 0 ? void 0 : _a.port) || 8750;
        switch (app.get('runtime_mode')) {
            case "development":
                port = process.env.PORT || ((_b = app.get('config')) === null || _b === void 0 ? void 0 : _b.port_dev) || 3000;
                break;
            case "production":
                port = process.env.PORT || ((_c = app.get('config')) === null || _c === void 0 ? void 0 : _c.port) || 8750;
                break;
        }
        if (app.get("config") != null) {
        }
        app.listen(port, function () {
            console.log("Listening on ".concat(port));
            console.log("View at http://localhost:".concat(port, " to connect locally.\n"));
        });
    };
    return ServerInit;
}());
exports.ServerInit = ServerInit;
//# sourceMappingURL=ServerInit.js.map