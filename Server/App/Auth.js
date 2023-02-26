"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var express_1 = require("express");
var ServerHelper_1 = require("../Modules/ServerHelper");
var bcrypt = require("bcrypt");
var Database_1 = require("../Modules/Database");
var saltRounds = 10;
var Auth = /** @class */ (function () {
    function Auth() {
        this.UsernameMinimum = 1;
        this.UsernameMaximum = 20;
        this.PasswordMinimum = 8;
        this.PasswordMaximum = 71; //Probably will be 72, but just to be safe.
    }
    Auth.prototype.GetName = function () {
        return "Auth";
    };
    Auth.prototype.GetRouter = function () {
        var _this = this;
        var router = (0, express_1.Router)();
        router.get("/", function (req, res) {
            (0, ServerHelper_1.RenderTemplate)(res, "Scheduler", "auth.ejs", {});
        });
        router.get('/create', function (req, res) {
            (0, ServerHelper_1.RenderTemplate)(res, 'Create Account', 'create.ejs', { m: "Enter a username and password." });
        });
        router.post('/create', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, password, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, ServerHelper_1.ContainsBodyArgs)(req, 'username', 'password')) {
                            (0, ServerHelper_1.RenderTemplate)(res, 'Create Account', 'create.ejs', { m: "Missing username or password." });
                            //res.render("login", {m: "Missing username or password."})
                        }
                        username = req.body.username;
                        password = req.body.password;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.Create(username, password)];
                    case 2:
                        _a.sent();
                        // @ts-ignore
                        req.session.username = username;
                        res.redirect('/');
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        (0, ServerHelper_1.RenderTemplate)(res, 'Create Account', 'create.ejs', { m: e_1.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        router.get('/login', function (req, res) {
            (0, ServerHelper_1.RenderTemplate)(res, 'Login', 'login.ejs', { m: "Enter a username and password." });
        });
        router.post('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, password, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, ServerHelper_1.ContainsBodyArgs)(req, 'username', 'password')) {
                            (0, ServerHelper_1.RenderTemplate)(res, 'Login', 'login.ejs', { m: "Missing username or password." });
                        }
                        username = req.body.username;
                        password = req.body.password;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.Login(username, password)];
                    case 2:
                        _a.sent();
                        // @ts-ignore
                        req.session.username = username;
                        res.redirect('/');
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log(e_2);
                        (0, ServerHelper_1.RenderTemplate)(res, 'Login', 'login.ejs', { m: e_2.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return router;
    };
    Auth.prototype.Create = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, e_3, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (username.length < this.UsernameMinimum) {
                            throw new Error("Username must be at least ".concat(this.UsernameMinimum, " characters long."));
                        }
                        if (username.length > this.UsernameMaximum) {
                            throw new Error("Username cannot be longer than ".concat(this.UsernameMaximum, " characters long."));
                        }
                        if (password.length < this.PasswordMinimum) {
                            throw new Error("Password must be at least ".concat(this.PasswordMinimum, " characters long."));
                        }
                        if (password.length > this.PasswordMaximum) {
                            throw new Error("Password cannot be longer than ".concat(this.PasswordMaximum, " characters long."));
                        }
                        return [4 /*yield*/, this.UsernameExists(username)];
                    case 1:
                        if (_a.sent()) {
                            throw new Error('Username already exists. Please choose a different username.');
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, bcrypt.hash(password, saltRounds)];
                    case 3:
                        hash = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        throw new Error("Error accepting password. Please supply a different password.");
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("insert into account (username, password) VALUES ($1, $2)", [username, hash])];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7:
                        e_4 = _a.sent();
                        console.log(e_4);
                        throw new Error("Error creating account. Please try again in a few minutes.");
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.UsernameExists = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("\n                select *\n                from account\n                where username=$1\n                limit 1\n        ", [username])];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.rows.length > 0];
                    case 2:
                        e_5 = _a.sent();
                        console.log(e_5);
                        throw new Error("Error connecting to database");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.Login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_6, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("\n                select password\n                from account\n                where username=$1\n        ", [username])];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        console.log(e_6);
                        throw new Error("Error connecting to database");
                    case 3:
                        if (data.rowCount == 0) {
                            throw new Error("Incorrect username or password.");
                        }
                        hash = data.rows[0]['password'];
                        return [4 /*yield*/, bcrypt.compare(password, hash)];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error("Incorrect username or password.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.Delete = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Auth.prototype.GetWebUrl = function () {
        return "/auth";
    };
    return Auth;
}());
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map