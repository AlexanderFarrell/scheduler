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
exports.Account = void 0;
var bcrypt = require("bcrypt");
var Database_1 = require("../../Modules/Database");
exports.Account = {
    username_minimum: 1,
    username_maximum: 20,
    password_minimum: 8,
    password_maximum: 71,
    salt_rounds: 10,
    creation_enabled: true,
    create: function (username, password, first_name, last_name) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!exports.Account.creation_enabled) {
                            throw new Error("Account creation is currently disabled. Please contact the administrator.");
                        }
                        return [4 /*yield*/, exports.Account.validate_username(username)];
                    case 1:
                        _a.sent();
                        exports.Account.validate_password(password);
                        if (first_name.length == 0) {
                            throw new Error("Please enter your first name");
                        }
                        if (last_name.length == 0) {
                            throw new Error("Please enter your last name");
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, bcrypt.hash(password, exports.Account.salt_rounds)];
                    case 3:
                        hash = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        throw new Error("Error accepting password. Please supply a different password.");
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("insert into account (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)", [username, hash, first_name, last_name])];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7:
                        e_2 = _a.sent();
                        console.log(e_2);
                        throw new Error("Error creating account. Please try again in a few minutes.");
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    login: function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_3, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("\n                select password, first_name, last_name\n                from account\n                where username=$1\n        ", [username])];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        throw new Error("Error connecting to database");
                    case 3:
                        if (data.rowCount == 0) {
                            throw new Error("Incorrect username or password.");
                        }
                        hash = data.rows[0]['password'];
                        return [4 /*yield*/, bcrypt.compare(password, hash)];
                    case 4:
                        if (_a.sent()) {
                            return [2 /*return*/, data.rows[0]];
                        }
                        else {
                            throw new Error("Incorrect username or password.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    Delete: function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    },
    username_exists: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var data, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Database_1.Data.Pool.query("\n                select *\n                from account\n                where username=$1\n                limit 1\n        ", [username])];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.rows.length > 0];
                    case 2:
                        e_4 = _a.sent();
                        console.log(e_4);
                        throw new Error("Error connecting to database");
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    validate_username: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (username.length < exports.Account.username_minimum) {
                            throw new Error("Username must be at least ".concat(exports.Account.username_minimum, " characters long."));
                        }
                        if (username.length > exports.Account.username_maximum) {
                            throw new Error("Username cannot be longer than ".concat(exports.Account.username_maximum, " characters long."));
                        }
                        return [4 /*yield*/, exports.Account.username_exists(username)];
                    case 1:
                        if (_a.sent()) {
                            throw new Error('Username already exists. Please choose a different username.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    validate_password: function (password) {
        if (password.length < exports.Account.password_minimum) {
            throw new Error("Password must be at least ".concat(exports.Account.password_minimum, " characters long."));
        }
        if (password.length > exports.Account.password_maximum) {
            throw new Error("Password cannot be longer than ".concat(exports.Account.password_maximum, " characters long."));
        }
    },
};
//# sourceMappingURL=auth_data.js.map